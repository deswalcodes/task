# Livestream Overlay Management Web App

This is a **Full Stack Livestreaming Web Application** that allows users to:
- Stream videos using **RTSP** URLs.
- Manage overlays (add, update, delete, position, and resize them) on the livestream in real-time.

---

## 🚀 Tech Stack
- **Frontend:** React (Vite) + Axios
- **Backend:** Python (Flask)
- **Database:** MongoDB Atlas
- **Streaming Engine:** FFmpeg
- **Video Playback:** HLS.js (converts RTSP to HLS)

---

## 📂 Code Repository Structure

```yaml
livestream-overlay-app/
├── backend/
│   ├── app.py          # Flask backend with streaming and overlay APIs
│   ├── overlay.json    # Overlay configuration storage
│   ├── ffmpeg_processes # Directory for FFmpeg processes/output
│   └── requirements.txt # Backend dependencies
└── frontend/
    ├── index.html
    ├── src/
    │   ├── App.jsx     # React frontend with overlay management
    │   └── components/ # React components for overlays
    └── vite.config.js  # Vite configuration
