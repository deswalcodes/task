import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import Draggable from 'react-draggable';

const API_URL = "http://localhost:5001/api";

function App() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({
    content: 'Sample Text',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 }
  });

  const fetchOverlays = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/overlays`);
      setOverlays(data);
    } catch (error) {
      console.error("Error fetching overlays:", error);
    }
  };

  useEffect(() => {
    fetchOverlays();
  }, []);

  const startStream = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/stream/start`, {
        rtsp_url: rtspUrl
      });
      setStreamUrl(`http://localhost:5001${data.url}`);
    } catch (error) {
      console.error("Error starting stream:", error);
      alert("Failed to start stream. Check console for details.");
    }
  };

  const stopStream = async () => {
    try {
      await axios.post(`${API_URL}/stream/stop`);
      setStreamUrl('');
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };

  const handleCreateOverlay = async () => {
    try {
      await axios.post(`${API_URL}/overlays`, newOverlay);
      setNewOverlay({
        content: '',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 50 }
      });
      fetchOverlays();
    } catch (error) {
      console.error("Error creating overlay:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/overlays/${id}`);
      fetchOverlays();
    } catch (error) {
      console.error("Error deleting overlay:", error);
    }
  };

  const handlePositionChange = (id, position) => {
    try {
      axios.put(`${API_URL}/overlays/${id}`, {
        position: { x: position.x, y: position.y }
      });
    } catch (error) {
      console.error("Error updating overlay position:", error);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Livestream Viewer</h1>

      <div className="stream-controls" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="rtsp://example.com/stream"
          style={{ padding: '10px', width: '400px', marginRight: '10px' }}
        />
        <button
          onClick={startStream}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Start Stream
        </button>
        <button
          onClick={stopStream}
          style={{
            padding: '10px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Stop Stream
        </button>
      </div>

      <div className="video-container" style={{ position: 'relative', width: '800px', margin: '0 auto', border: '1px solid #ddd' }}>
        {streamUrl ? (
          <ReactPlayer
            url={streamUrl}
            controls
            width="800px"
            height="450px"
            playing={true}
            config={{
              file: {
                forceHLS: true,
                hlsOptions: {
                  debug: true
                }
              }
            }}
          />
        ) : (
          <div style={{ width: '800px', height: '450px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Enter an RTSP URL and click "Start Stream"</p>
          </div>
        )}

        {overlays.map((overlay) => {
          const width = overlay?.size?.width || 200;
          const height = overlay?.size?.height || 50;
          const position = overlay?.position || { x: 50, y: 50 };

          return (
            <Draggable
              key={overlay._id}
              defaultPosition={position}
              onStop={(e, data) => handlePositionChange(overlay._id, { x: data.x, y: data.y })}
            >
              <div style={{
                position: 'absolute',
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: '1px solid white',
                cursor: 'move',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}>
                {overlay.content}
                <button
                  onClick={() => handleDelete(overlay._id)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  X
                </button>
              </div>
            </Draggable>
          );
        })}
      </div>

      <div className="overlay-form" style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', width: '800px' }}>
        <h2>Create Overlay</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overlay Content: </label>
          <input
            type="text"
            value={newOverlay.content}
            onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
            placeholder="Enter text or image URL"
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Width:</label>
            <input
              type="number"
              value={newOverlay.size.width}
              onChange={(e) => setNewOverlay({
                ...newOverlay,
                size: { ...newOverlay.size, width: parseInt(e.target.value) }
              })}
              style={{ padding: '10px', width: '100px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Height:</label>
            <input
              type="number"
              value={newOverlay.size.height}
              onChange={(e) => setNewOverlay({
                ...newOverlay,
                size: { ...newOverlay.size, height: parseInt(e.target.value) }
              })}
              style={{ padding: '10px', width: '100px' }}
            />
          </div>
        </div>

        <button
          onClick={handleCreateOverlay}
          style={{
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add Overlay
        </button>
      </div>
    </div>
  );
}

export default App;
