import os
from dotenv import load_dotenv


load_dotenv()


class _Settings:
	# Epic SMART on FHIR OAuth
	EPIC_CLIENT_ID: str = os.getenv("EPIC_CLIENT_ID", "")
	# Optionally provide issuer (preferred) to enable discovery at runtime
	EPIC_ISSUER: str | None = os.getenv("EPIC_ISSUER")
	# Or provide explicit endpoints (used if discovery not configured)
	EPIC_AUTH_URL: str | None = os.getenv("EPIC_AUTH_URL")
	EPIC_TOKEN_URL: str | None = os.getenv("EPIC_TOKEN_URL")
	# Optional audience (FHIR base URL) if your Epic app requires it
	EPIC_AUD: str | None = os.getenv("EPIC_AUD")

	# Default scopes for standalone patient app login (SMART on FHIR)
	# Includes required launch/patient and specific resource reads instead of wildcard
	EPIC_SCOPES: str = os.getenv(
		"EPIC_SCOPES",
		"openid profile offline_access launch/patient "
		"patient/Patient.read patient/Observation.read patient/Condition.read",
	)


settings = _Settings()
