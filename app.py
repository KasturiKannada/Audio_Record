from flask import Flask, jsonify
from flask import Flask, render_template, request, redirect, Response, abort
from flask_cors import CORS, cross_origin
import json
import base64
import os
import os.path
import time
from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"]

creds = None
json_creds = os.getenv("GOOGLE_SHEETS_CREDS_JSON")

app = Flask(__name__)
CORS(app)


@app.route("/store_file", methods=["POST"])
def store_file():
    OUTPUT_FOLDER = "Audio_Files"
    language = request.json["language"]
    topic = request.json["topic"]
    index = request.json["index"]

    language = language.replace("data:audio/x-mpeg-3;base64,", "")
    d = base64.b64decode(language, " /")

    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                json.loads(os.environ.get(json_creds), SCOPES)
            )
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    service = build("drive", "v3", credentials=creds)
    results = (
        service.files()
        .list(pageSize=10, fields="nextPageToken, files(id, name)")
        .execute()
    )

    items = results.get("files", [])
    if not items:
        print("No files found.")
    else:
        print("Files:")
        for item in items:
            print(u"{0} ({1})".format(item["name"], item["id"]))

    timestr = time.strftime("%Y%m%d-%H%M%S")

    return jsonify({"success": index})


if __name__ == "__main__":
    app.run(debug=True, port=33507)
