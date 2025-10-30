import requests

MYCHART_BASE_URL = "https://mychart.example.com/MyChart/fhir"

def make_mychart_request(endpoint, access_token, params=None):
    """Helper for GET requests to the MyChart FHIR API."""
    url = f"{MYCHART_BASE_URL}/{endpoint}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": f"Request failed: {response.status_code}",
            "details": response.text
        }

def get_patient_data(access_token):
    """Fetch basic patient data from MyChart."""
    return make_mychart_request("Patient", access_token)