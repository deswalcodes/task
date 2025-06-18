import os
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)


client = MongoClient("mongodb+srv://21cs2014:xJdmk0jkdV0jd0rh@cluster0.x4o0n.mongodb.net/")
db = client["livestream_db"]
overlays = db["overlays"]


ffmpeg_process = None


def serialize_document(document):
    if '_id' in document:
        document['_id'] = str(document['_id'])
    return document

@app.route('/api/stream/start', methods=['POST'])
def start_stream():
    global ffmpeg_process
    data = request.get_json()
    rtsp_url = data.get('rtsp_url')

    if not rtsp_url:
        return jsonify({"error": "RTSP URL required"}), 400

    
    if ffmpeg_process:
        ffmpeg_process.terminate()

    output_dir = "static/stream"
    os.makedirs(output_dir, exist_ok=True)

    command = [
        "ffmpeg",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-hls_time", "4",
        "-hls_list_size", "5",
        "-hls_flags", "delete_segments",
        "-start_number", "0",
        f"{output_dir}/stream.m3u8"
    ]

    ffmpeg_process = subprocess.Popen(command)
    return jsonify({"message": "Stream started", "url": "/static/stream/stream.m3u8"})


@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({"error": "Missing data"}), 400

    result = overlays.insert_one(data)
    overlay = overlays.find_one({"_id": result.inserted_id})
    return jsonify(serialize_document(overlay)), 201


@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    all_overlays = [serialize_document(overlay) for overlay in overlays.find()]
    return jsonify(all_overlays)


@app.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.get_json()
    result = overlays.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    if result.modified_count == 0:
        return jsonify({"error": "Overlay not found"}), 404

    updated_overlay = overlays.find_one({"_id": ObjectId(id)})
    return jsonify(serialize_document(updated_overlay))


@app.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    result = overlays.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Overlay not found"}), 404

    return jsonify({"message": "Overlay deleted"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
