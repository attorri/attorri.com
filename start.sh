#!/bin/bash

# Function to stop all background processes on script termination
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Check if ports are in use
if lsof -i:5001 > /dev/null 2>&1; then
    echo "Port 5001 is already in use. Please free it first."
    exit 1
fi

if lsof -i:5002 > /dev/null 2>&1; then
    echo "Port 5002 is already in use. Please free it first."
    exit 1
fi

if lsof -i:5173 > /dev/null 2>&1; then
    echo "Port 5173 is already in use. Please free it first."
    exit 1
fi

# Start main Flask server
echo "Starting main Flask server on port 5001..."
cd server
FLASK_ENV=development FLASK_DEBUG=1 python app.py &
FLASK_PID=$!

# Wait for main Flask server to start
until lsof -i:5001 > /dev/null 2>&1; do
    sleep 1
done
echo "Main Flask server is running on http://localhost:5001"

# Start Stability AI Flask server
echo "Starting Stability AI server on port 5002..."
FLASK_ENV=development FLASK_DEBUG=1 python stability.py &
STABILITY_PID=$!

# Wait for Stability AI server to start
until lsof -i:5002 > /dev/null 2>&1; do
    sleep 1
done
echo "Stability AI server is running on http://localhost:5002"

# Start React app
echo "Starting React app on port 5173..."
cd ../attorri-website
npm run dev &
VITE_PID=$!

# Wait for Vite server to start
until lsof -i:5173 > /dev/null 2>&1; do
    sleep 1
done
echo "React app is running on http://localhost:5173"
echo "Visit http://localhost:5173/yolo to access the YOLO detection page"
echo "Visit http://localhost:5173/stability to access the Stability AI image generation page"

# Keep script running and show logs
wait 