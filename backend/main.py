from flask import Flask, redirect, request, jsonify

app = Flask(__name__)

# Load from environment variables
CLIENT_ID = '793b474b-6ef6-4107-98c5-e84f9dd72566'  # os.getenv("CLIENT_ID")
REDIRECT_URI = "http://localhost:5000/callback" 
MYCHART_AUTH_URL = "https://mychart.example.com/MyChart/oauth2/authorize"
MYCHART_TOKEN_URL = "https://mychart.example.com/MyChart/oauth2/token"


@app.route("/")
def index():
    """Home route with link to connect MyChart"""
    auth_url = (
        f"{MYCHART_AUTH_URL}?response_type=code"
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

    # For now, just return the code — later you'll exchange it for a token
    return jsonify({"authorization_code": code})


if __name__ == "__main__":
    app.run(debug=True)
