
from flask import Flask, jsonify
from flask import Flask, render_template, request, redirect, Response,abort
from flask_cors import CORS, cross_origin
import json
import base64
import os
import os.path
import time

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import httplib2
from apiclient import discovery

# use creds to create a client to interact with the Google Drive API
scope = ['https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_dict(json.loads(os.environ.get('CREDENTIALS')), scope)
client = gspread.authorize(creds)


http = creds.authorize(httplib2.Http())
service = discovery.build('drive', 'v3', http=http, cache_discovery=False)

app = Flask(__name__)
CORS(app)

@app.route('/store_file', methods=['POST'])
def store_file():
    OUTPUT_FOLDER = "Audio_Files"
    language = request.json['language']    
    topic = request.json['topic']  
    ix = request.json['index']

    language=language.replace('data:audio/x-mpeg-3;base64,', '')
    mp3 = base64.b64decode(language,' /')

    timestr = time.strftime("%Y%m%d-%H%M%S")
    service.files().copy(fileId=mp3,
                         body={{"parents": [topic],
                                "name": ix,
                                "kind": "drive#fileLink"
                                }).execute()
    return jsonify({"success": index})

if __name__ == '__main__':
    app.run(debug=True, port=33507)
