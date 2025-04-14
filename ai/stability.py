import requests
import os 
from dotenv import load_dotenv

load_dotenv(override=True)

api_key = os.getenv('STABILITY_API_KEY')

def get_api_key():
    # Verify that the new API key is being used
    print("API Key:")
    print(api_key)


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
        file_name = prompt.replace(" ", "_") + ".webp"
        with open(f"./{file_name}.webp", 'wb') as file:
            file.write(response.content)
    else:
        raise Exception(str(response.json()))
    
def main():
    call_stability_api("Black and white 4k drawing of a samurai in the middle of the desert")

if __name__ == "__main__":
    main()