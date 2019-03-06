
from flask import Flask, jsonify
from flask import Flask, render_template, request, redirect, Response,abort
from flask_cors import CORS, cross_origin
import json
import base64
import os
import os.path
import time
import redis

app = Flask(__name__)
CORS(app)

redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
redis = redis.from_url(redis_url)

@app.route('/store_file', methods=['POST'])
def store_file():
    OUTPUT_FOLDER = "Audio_Files"
    language = request.json['language']    
    topic = request.json['topic']  
    ix = request.json['index']

    language=language.replace('data:audio/x-mpeg-3;base64,', '')
    mp3 = base64.b64decode(language,' /')

    timestr = time.strftime("%Y%m%d-%H%M%S")
    redis.set("audio", mp3)
    redis.set("topic", topic)
    redis.set("idx", ix)
    return jsonify({"success": index})

if __name__ == '__main__':
    app.run(debug=True, port=33507)
