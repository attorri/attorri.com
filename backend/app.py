import boto3, json
from flask import Flask, send_from_directory, request, jsonify, abort
import os

bedrock = boto3.client(
    service_name="bedrock",
    region_name="us-east-1",
)

bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1",
)

"""
DeepSeek R1 API Call
    {
  "modelId": "deepseek.r1-v1:0",
  "contentType": "application/json",
  "accept": "application/json",
  "body": {
    "inferenceConfig": {
      "max_tokens": 512
    },
    "messages": [
      {
        "role": "user",
        "content": "this is where you place your input text"
      }
    ]
  }
}
"""

model_id = 'deepseek.r1-v1:0'

def model_summary(model_id):
    response = bedrock.list_foundation_models()
    for model in response['modelSummaries']:
        if model['modelId'] == model_id:
            return json.dumps(model, indent=0)
    return None

#print(model_summary(model_id))


prompts = ["Explain traveling salesman problem for a 10 year old.",
    "Explain why big 4 consulting firms want to replace their consultants with AI.",
    "Explain the difference between a LLM and a chatbot." ,
    "Explain why leetcode is a good way to prepare for technical interviews." ,
    "Explain the bursting balloons leetcode problem to a child."
    ]

def converse_deepseek(prompt):
    
    system_messages = [
        {
            "text": "You are a helpful AI assistant",
        }
    ]

    messages = [
        {
           "role": "user",
           "content": [
               {
                   "text": prompt,
               }
           ]
        }
    ]
    
    response = bedrock_runtime.converse(
        modelId='us.deepseek.r1-v1:0',
        inferenceConfig={
            "maxTokens": 512,  # Increased token limit for fuller responses
        },
        system=system_messages,
        messages=messages,
    )
    
    return response


def converse_stream_deepseek(prompt):
    system_messages = [
        {
            "text": "You are a helpful AI assistant. Provide brief reasoning followed by a concise answer.",
        }
    ]

    messages = [
        {
           "role": "user",
           "content": [
               {
                   "text": prompt,
               }
           ]
        }
    ]
    
    streaming_response = bedrock_runtime.converse_stream(
        modelId='us.deepseek.r1-v1:0',
        inferenceConfig={
            "maxTokens": 30000,
            "temperature": 0.5,
        },
        system=system_messages,
        messages=messages,
    )
    
    return streaming_response

# for prompt in prompts:
#     _json = converse_deepseek(prompt)
#     content = _json['output']['message']['content']
    
#     # Print both reasoning and final answer
#     print("Prompt:", prompt)
#     print("\nComplete Response:")
#     for item in content:
#         if 'reasoningContent' in item:
#             print("\nReasoning:")
#             print(item['reasoningContent']['reasoningText']['text'])
#         if 'text' in item:
#             print("\nFinal Answer:")
#             print(item['text'])
#     print("-"*100)

# Initialize Flask app
app = Flask(__name__)

# Get the project root directory
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Serve main site files
@app.route('/')
def home():
    try:
        return send_from_directory(PROJECT_ROOT, 'index.html')
    except Exception as e:
        print(f"Error serving index.html: {str(e)}")
        abort(404)

# Serve AI section
@app.route('/ai')
def ai_page():
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'ai'), 'index.html')
    except Exception as e:
        print(f"Error serving AI page: {str(e)}")
        abort(404)

@app.route('/ai/ai.js')
def ai_js():
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'ai'), 'ai.js')
    except Exception as e:
        print(f"Error serving ai.js: {str(e)}")
        abort(404)

# Chat endpoint
@app.route('/ai/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt', '')
    
    try:
        response = converse_stream_deepseek(prompt)
        answer = ""
        for chunk in response['stream']:
            if 'contentBlockDelta' in chunk:
                delta = chunk['contentBlockDelta']['delta']
                if 'text' in delta:
                    answer += delta['text']
        
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Print the paths for debugging
    print(f"Project root: {PROJECT_ROOT}")
    print(f"AI directory: {os.path.join(PROJECT_ROOT, 'ai')}")
    app.run(debug=True, port=5000)