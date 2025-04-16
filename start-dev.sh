#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development environment...${NC}"

# Check if Python and Node.js are installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install it first.${NC}"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Kill processes on ports if they exist
if check_port 5001; then
    echo -e "${BLUE}Port 5001 is in use. Attempting to free it...${NC}"
    lsof -ti:5001 | xargs kill -9
fi

if check_port 3000; then
    echo -e "${BLUE}Port 3000 is in use. Attempting to free it...${NC}"
    lsof -ti:3000 | xargs kill -9
fi

# Start Flask server in background
echo -e "${BLUE}Starting Flask server...${NC}"
cd server
python3 app.py &
FLASK_PID=$!

# Wait for Flask server to start
echo -e "${BLUE}Waiting for Flask server to be ready...${NC}"
until check_port 5001; do
    sleep 1
done
echo -e "${GREEN}Flask server is running on port 5001${NC}"

# Start React development server
echo -e "${BLUE}Starting React development server...${NC}"
cd ../attorri-website
npm run dev &
REACT_PID=$!

# Wait for React server to start
echo -e "${BLUE}Waiting for React server to be ready...${NC}"
until check_port 3000; do
    sleep 1
done
echo -e "${GREEN}React development server is running on port 3000${NC}"

# Function to cleanup processes on script exit
cleanup() {
    echo -e "${BLUE}Shutting down servers...${NC}"
    kill $FLASK_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Development environment is ready!${NC}"
echo -e "${BLUE}Flask server: ${NC}http://localhost:5001"
echo -e "${BLUE}React app: ${NC}http://localhost:3000"
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Keep script running
wait 