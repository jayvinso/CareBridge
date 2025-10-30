from flask import Flask, redirect, request, jsonify
import os
import requests
from dotenv import load_dotenv
# import functions here

load_dotenv()

app = Flask(__name__)

# --- Configuration ---
CLIENT_ID = os.getenv("MYCHART_CLIENT_ID")
REDIRECT_URI = "http://localhost:5000/callback"

MYCHART_BASE_URL = "https://mychart.example.com/MyChart"
AUTH_URL = f"{MYCHART_BASE_URL}/oauth2/authorize"
TOKEN_URL = f"{MYCHART_BASE_URL}/oauth2/token"


@app.route("/")
def index():
    """Home route with link to connect MyChart"""
    auth_url = (
        f"{AUTH_URL}?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=openid%20profile%20patient.read"
    )
    return jsonify({"connect_url": auth_url})


@app.route("/callback")
def callback():
    """Handles redirect after user logs in to MyChart"""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    # Exchange authorization code for access token
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
    }

    token_response = requests.post(TOKEN_URL, data=token_data)

    if token_response.status_code != 200:
        return jsonify({"error": "Failed to exchange token", "details": token_response.text}), 400

    tokens = token_response.json()
    access_token = tokens.get("access_token")

    # Example call to your custom function
    patient_data = get_patient_data(access_token)

    return jsonify({
        "access_token": access_token,
        "patient_data": patient_data
    })


if __name__ == "__main__":
    app.run(debug=True)
