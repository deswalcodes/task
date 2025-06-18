# Livestream Overlay Management App

This is a **full-stack livestream overlay management application** built with:
- **Backend:** Flask, MongoDB, FFmpeg
- **Frontend:** React, Vite, Axios, React Draggable

The application allows users to:
- Play an RTSP livestream.
- Manage overlays (create, update position, delete).
- Drag overlays live on the video stream.

---

## Folder Structure

```text
LIVESTREAM-APP
├── .venv
├── backend
│   ├── static
│   ├── venv
│   ├── .env
│   ├── app.py
│   └── requirements.txt
├── fe
│   ├── node_modules
│   ├── public
│   ├── src
│   │   └── App.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```
---
Technologies Used
Backend: Flask, FFmpeg, MongoDB, PyMongo, Flask-CORS, Python Dotenv

Frontend: React, Vite, Axios, React-Draggable, React-Player

Database: MongoDB Atlas

Video Streaming: FFmpeg (HLS streaming)

Environment Variables: Python Dotenv for MongoDB URL storage
---

## 🛠️ Setup Instructions

### Backend
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Create a `.env` file in the `backend` directory with your MongoDB connection string:
    ```ini
    MONGO_URL=your_mongo_connection_string
    ```

5.  Run the backend server:
    ```bash
    python app.py
    ```
    The backend will run on `http://localhost:5001`.

### Frontend
1.  Navigate to the `frontend` directory:
    ```bash
    cd fe
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173`.
    ---
## API Documentation

### Base URL
http://localhost:5001/api

### Endpoints

### 1. Start Livestream
**POST** `/stream/start`

**Body:**
{ "rtsp_url": "your_rtsp_url" }

**Response:**
{ "message": "Stream started", "url": "/static/stream/stream.m3u8" }

2. Create Overlay
POST /overlays

Body:

json
Copy
Edit
{
  "content": "Overlay text or image URL",
  "position": { "x": 50, "y": 50 },
  "size": { "width": 200, "height": 50 }
}
Response: Created overlay object.

3. Get All Overlays
GET /overlays

Response: Array of overlay objects.

4. Update Overlay Position
PUT /overlays/:id

Body:

json
Copy
Edit
{ "position": { "x": 100, "y": 150 } }
Response: Updated overlay object.

5. Delete Overlay
DELETE /overlays/:id

Response:

json
Copy
Edit
{ "message": "Overlay deleted" }
User Documentation
How to Use the App
Start the Backend:

Make sure your Flask backend is running on port 5001.

Start the Frontend:

Open the React app on http://localhost:5173.

Input RTSP URL:

Enter a valid RTSP stream URL (you can use services like RTSP.me to generate test streams).

Click Start Stream to begin streaming.

Managing Overlays:

Create new overlays using the provided form.

Overlays can be:

Dragged and repositioned live on the video.

Deleted using the 'X' button on the overlay.

All overlays persist in the MongoDB database.

Stop Stream:

Click Stop Stream to stop the current stream.
