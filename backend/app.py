import boto3, json

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
            "maxTokens": 30000,            # Reduced token limit
            "temperature": 0.5,          # Increased for more creative and unpredictable responses
        },
        system=system_messages,
        messages=messages,
    )
    
    print("\nPrompt:", prompt, "\n")
    for chunk in streaming_response['stream']:
        if 'contentBlockDelta' in chunk:
            delta = chunk['contentBlockDelta']['delta']
            if 'reasoningContent' in delta:
                if 'text' in delta['reasoningContent']:
                    reasoning_text = delta['reasoningContent']['text']
                    print("\033[92m" + reasoning_text + "\033[0m", end="")
            if 'text' in delta:
                text = delta['text']
                print(text, end="")
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

converse_stream_deepseek(prompts[4])