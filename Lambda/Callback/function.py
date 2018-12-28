import requests
import base64
import json
import os

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
# Either https://nguyenjkevin.com/SpotiSync?code= or https://localhost:4200?code=
REDIRECT_URL = os.environ['REDIRECT_URL']
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_API_URL = "https://api.spotify.com/v1"

def lambda_handler(event, context):
    auth_token = event['queryStringParameters']['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": 'https://opy5ngmrb4.execute-api.us-east-1.amazonaws.com/dev/api/callback'
    }
    auth = "{}:{}".format(CLIENT_ID, CLIENT_SECRET)
    base64encoded = base64.urlsafe_b64encode(auth.encode('UTF-8')).decode('ascii')
    headers = {"Authorization": "Basic {}".format(base64encoded)}
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    response_data = json.loads(post_request.text)
    if 'error' in response_data:
        return {
            'statusCode': 400,
            'body': json.dumps(response_data)
        }

    access_token = response_data["access_token"]
    return {
        'statusCode': 301,
        'body': None,
        'headers': {
            'Location': REDIRECT_URL + access_token
        }
    }