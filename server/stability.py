import requests
import os 
from dotenv import load_dotenv
from flask import Flask, request, send_file
from flask_cors import CORS
import io

load_dotenv(override=True)

api_key = os.getenv('STABILITY_API_KEY')
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def call_stability_api(prompt):
    response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/generate/core",
        headers={
            "authorization": f"Bearer {api_key}",
            "accept": "image/*"
        },
        files={"none": ''},
        data={
            "prompt": prompt,
            "output_format": "webp",
        },
    )

    if response.status_code == 200:
        return response.content
    else:
        raise Exception(str(response.json()))

@app.route('/generate')
def generate_image():
    prompt = request.args.get('prompt', 'a beautiful sunset over mountains')  # Default prompt if none provided
    
    try:
        image_data = call_stability_api(prompt)
        return send_file(
            io.BytesIO(image_data),
            mimetype='image/webp',
            as_attachment=True,
            download_name=f"{prompt.replace(' ', '_')}.webp"
        )
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(port=5002)