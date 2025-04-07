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
            "maxTokens": 100,
        },
        system=system_messages,
        messages=messages,
    )
    
    return response
    
for prompt in prompts:
    _json = converse_deepseek(prompt)
    response = _json['output']
    
    # Print both reasoning and final answer
    print("Prompt:", prompt)
    print("\nReasoning:")
    print(response[0]['text'])  # Reasoning
    print("\nAnswer:")
    print(response[1]['text'])  # Final answer
    print("-"*100)