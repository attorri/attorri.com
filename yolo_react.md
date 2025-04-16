# YOLO Object Detection with React and Flask

This guide explains how to set up and run the real-time object detection system using YOLO, React, and Flask.

## Prerequisites

- Python 3.x
- Node.js and npm
- Webcam access
- macOS (for these specific instructions)

## Project Structure

```
attorri.com/
├── server/
│   ├── app.py
│   └── yolov8n.pt
└── attorri-website/
    ├── src/
    │   └── pages/
    │       └── YoloPage.tsx
    ├── package.json
    └── ...
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/attorri.com.git
   cd attorri.com
   ```

2. **Install Python Dependencies**
   ```bash
   pip install flask flask-cors ultralytics opencv-python
   ```

3. **Install Node.js Dependencies**
   ```bash
   cd attorri-website
   npm install
   cd ..
   ```

4. **Copy YOLO Model**
   ```bash
   # Make sure yolov8n.pt is in the server directory
   cp attorri-website/yolov8n.pt server/
   ```

## Running the Application

1. **Make the start script executable**
   ```bash
   chmod +x start.sh
   ```

2. **Start both servers**
   ```bash
   ./start.sh
   ```

3. **Access the application**
   - Open your browser and go to `http://localhost:5173/yolo`
   - Grant camera permissions when prompted
   - The Flask server will be running on `http://localhost:5001`

## Troubleshooting

- If you see "Camera access denied", check your browser and OS camera permissions
- On macOS, you may need to grant camera permissions to your terminal application
- If ports 5001 or 5173 are in use, stop other services using these ports
- If the video feed doesn't appear, ensure the Flask server is running properly

## Features

- Real-time object detection using YOLOv8
- Live video feed from your webcam
- Object bounding boxes with labels and confidence scores
- Responsive web interface

## Stopping the Application

- Press `Ctrl+C` in the terminal running `start.sh` to stop both servers

## Notes

- The Flask server runs on port 5001
- The React development server runs on port 5173
- Camera initialization may take a few seconds
- First YOLO model load may take a moment 