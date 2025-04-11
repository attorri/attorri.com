from http.server import HTTPServer, SimpleHTTPRequestHandler
import subprocess
import os
import json

class YOLOHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Change to the project root directory
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        os.chdir(project_root)
        super().__init__(*args, **kwargs)

    def do_POST(self):
        print(f"Received POST request to path: {self.path}")  # Debug log
        if self.path == '/start-yolo' or self.path == '/ai/start-yolo':
            try:
                print("Starting YOLO script...")  # Debug log
                # Change to the backend directory to run yolo.py
                backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)))
                os.chdir(backend_dir)
                
                # Use the virtual environment's Python interpreter
                venv_python = os.path.join(backend_dir, 'venv', 'bin', 'python')
                if not os.path.exists(venv_python):
                    print(f"Virtual environment not found at {venv_python}")
                    raise Exception("Virtual environment not found. Please run: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt")
                
                # Start YOLO script with the virtual environment's Python
                process = subprocess.Popen([venv_python, 'yolo.py'])
                print(f"YOLO process started with PID: {process.pid}")  # Debug log
                
                # Change back to project root
                os.chdir(os.path.join(backend_dir, '..'))
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            except Exception as e:
                print(f"Error starting YOLO: {str(e)}")  # Debug log
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode())
        else:
            print(f"Unhandled POST path: {self.path}")  # Debug log
            super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, YOLOHandler)
    print('Server running at http://localhost:8000')
    print('You can access the AI page at http://localhost:8000/ai/index.html')
    print('Waiting for requests...')
    httpd.serve_forever() 