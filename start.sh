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

if lsof -i:5173 > /dev/null 2>&1; then
    echo "Port 5173 is already in use. Please free it first."
    exit 1
fi

# Start Flask server
echo "Starting Flask server on port 5001..."
cd server
FLASK_ENV=development FLASK_DEBUG=1 python app.py &
FLASK_PID=$!

# Wait for Flask server to start
until lsof -i:5001 > /dev/null 2>&1; do
    sleep 1
done
echo "Flask server is running on http://localhost:5001"

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

# Keep script running and show logs
wait 