from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse
from app.core.config import settings
import base64
import hashlib
import os
import secrets
from typing import Dict, Optional, Tuple
from urllib.parse import urlencode
import httpx


router = APIRouter(prefix="/oauth/epic", tags=["oauth-epic"]) 


# In-memory store for demo purposes only. Replace with persistent/session storage in production.
_state_store: Dict[str, Dict[str, str]] = {}


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _pkce_pair() -> Tuple[str, str]:
    code_verifier = _b64url(os.urandom(32))  # 43-128 chars after base64url
    digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
    code_challenge = _b64url(digest)
    return code_verifier, code_challenge


def _get_auth_token_endpoints(issuer: Optional[str] = None):
    # Priority: issuer discovery -> explicit env endpoints -> Epic default non-prod
    auth_url = None
    token_url = None

    iss = issuer or settings.EPIC_ISSUER
    if iss:
        # Try OIDC discovery (best effort). Many issuers expose .well-known/openid-configuration
        # If this fails, fall back to env or default.
        well_known = None
        for path in ("/.well-known/openid-configuration", "/.well-known/smart-configuration"):
            try:
                url = iss.rstrip("/") + path
                resp = httpx.get(url, timeout=5.0)
                if resp.status_code == 200:
                    well_known = resp.json()
                    break
            except Exception:
                pass
        if well_known:
            auth_url = well_known.get("authorization_endpoint")
            token_url = well_known.get("token_endpoint")

    # Fallback to explicit env
    auth_url = auth_url or settings.EPIC_AUTH_URL
    token_url = token_url or settings.EPIC_TOKEN_URL

    # Final fallback to Epic public sandbox defaults
    if not auth_url:
        auth_url = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize"
    if not token_url:
        token_url = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token"

    return auth_url, token_url


def _external_base_url(request: Request) -> str:
    """Build an external base URL (scheme + host) respecting proxy headers.
    Ensures https is used for ngrok-style hosts since TLS is terminated at the edge.
    """
    headers = request.headers
    host = headers.get("x-forwarded-host") or headers.get("host") or request.url.hostname
    proto = headers.get("x-forwarded-proto") or ("https" if host and ("ngrok" in host) else request.url.scheme)
    return f"{proto}://{host}".rstrip("/")


@router.get("/start")
async def epic_start(
    request: Request,
    app_redirect: str,
    client_id: Optional[str] = None,
    issuer: Optional[str] = None,
    scope: Optional[str] = None,
    aud: Optional[str] = None,
    debug: Optional[bool] = False,
):
    """
    Initiates Epic SMART on FHIR Authorization Code + PKCE flow.

    Query params:
      - app_redirect: deep link back to the app (e.g., carebridge://oauth/success)
      - client_id: overrides EPIC_CLIENT_ID env if provided
      - issuer: optional issuer to attempt discovery
      - scope: optional override of scopes
    """
    cid = (client_id or settings.EPIC_CLIENT_ID).strip()
    if not cid:
        return JSONResponse({"error": "Missing EPIC client id"}, status_code=400)

    auth_url, _ = _get_auth_token_endpoints(issuer)

    # Compute callback URL from current request (uses ngrok host if called via ngrok)
    base = _external_base_url(request)
    redirect_uri = f"{base}/oauth/epic/callback"

    # PKCE
    code_verifier, code_challenge = _pkce_pair()
    # CSRF state
    state = secrets.token_urlsafe(24)

    # Store verifier + app deep link to use in callback
    _state_store[state] = {
        "code_verifier": code_verifier,
        "app_redirect": app_redirect,
        # Keep track of issuer used for later token exchange
        "issuer": issuer or (settings.EPIC_ISSUER or ""),
        # Persist the client_id used for the auth request to reuse in token exchange
        "client_id": cid,
    }

    scopes = (scope or settings.EPIC_SCOPES).strip()
    audience = (aud or settings.EPIC_AUD)

    # Build authorization URL
    params = {
        "response_type": "code",
        "client_id": cid,
        "redirect_uri": redirect_uri,
        "scope": scopes,
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    }
    if audience:
        params["aud"] = audience

    # Convert to query string with proper encoding
    query = urlencode(params)
    url = f"{auth_url}?{query}"

    if debug:
        # Return the constructed values for troubleshooting rather than redirecting
        return JSONResponse(
            {
                "authorize_url": url,
                "authorize_endpoint": auth_url,
                "token_endpoint": _get_auth_token_endpoints(issuer)[1],
                "redirect_uri": redirect_uri,
                "client_id": cid,
                "scope": scopes,
                "state": state,
                "code_challenge": code_challenge,
                "code_challenge_method": "S256",
                "aud": audience,
                "issuer": issuer or settings.EPIC_ISSUER,
            }
        )

    return RedirectResponse(url, status_code=302)


@router.get("/callback")
async def epic_callback(request: Request, code: Optional[str] = None, state: Optional[str] = None, error: Optional[str] = None, error_description: Optional[str] = None):
    """
    Handles Epic redirect. Exchanges code for tokens and then redirects to app deep link.
    """
    # Retrieve stored info
    entry = _state_store.pop(state or "", None)
    # Compute our redirect_uri again for token exchange
    base = _external_base_url(request)
    redirect_uri = f"{base}/oauth/epic/callback"

    if error:
        app_redirect = entry["app_redirect"] if entry else None
        dest = (app_redirect or "carebridge://oauth/success") + f"?result=error&message={httpx.QueryParams({'m': error_description or error})['m']}"
        return RedirectResponse(dest, status_code=302)

    if not entry or not code:
        # Missing/invalid state or code
        dest = "carebridge://oauth/success?result=error&message=invalid_state_or_code"
        return RedirectResponse(dest, status_code=302)

    code_verifier = entry["code_verifier"]
    issuer = entry.get("issuer") or None
    client_id = entry.get("client_id") or settings.EPIC_CLIENT_ID

    _, token_url = _get_auth_token_endpoints(issuer)

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "code_verifier": code_verifier,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(token_url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
        if resp.status_code >= 200 and resp.status_code < 300:
            # Tokens received (not stored for now as requested)
            app_redirect = entry["app_redirect"]
            dest = f"{app_redirect}?result=success"
            return RedirectResponse(dest, status_code=302)
        else:
            app_redirect = entry["app_redirect"]
            msg = resp.text
            dest = f"{app_redirect}?result=error&message={httpx.QueryParams({'m': msg})['m']}"
            return RedirectResponse(dest, status_code=302)
    except Exception as e:
        app_redirect = entry["app_redirect"]
        dest = f"{app_redirect}?result=error&message={httpx.QueryParams({'m': str(e)})['m']}"
        return RedirectResponse(dest, status_code=302)
