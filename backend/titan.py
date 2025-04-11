import boto3
import json
import time
import sys
from typing import Optional

class TitanClient:
    def __init__(self, region_name='us-east-1'):
        """Initialize the Titan client with AWS Bedrock.
        
        Args:
            region_name (str): AWS region name. Defaults to 'us-east-1'.
        """
        self.client = boto3.client('bedrock', region_name=region_name)
        self.runtime_client = boto3.client('bedrock-runtime', region_name=region_name)
        self.model_id = 'amazon.titan-tg1-large'

    def _print_with_typing(self, text: str, delay: float = 0.02) -> None:
        """Print text with a typing effect.
        
        Args:
            text (str): Text to print
            delay (float): Delay between characters in seconds
        """
        for char in text:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(delay)
        print()

    def generate(self, prompt: str, max_tokens: int = 150, temperature: float = 1.0) -> Optional[str]:
        """Generate text using Titan model.
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature (0.0 to 1.0)
            
        Returns:
            Optional[str]: Generated text
        """
        try:
            response = self.runtime_client.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "inputText": prompt,
                    "textGenerationConfig": {
                        "maxTokenCount": max_tokens,
                        "temperature": temperature,
                        "topP": 0.9,
                        "stopSequences": []
                    }
                }),
                contentType='application/json',
                accept='application/json'
            )
            
            response_body = json.loads(response['body'].read())
            return response_body['results'][0]['outputText']
            
        except Exception as e:
            print(f"Error generating text: {str(e)}")
            return None

    def generate_stream(self, prompt: str, max_tokens: int = 8192, temperature: float = 1.0) -> None:
        """Generate text using Titan model with streaming.
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature (0.0 to 1.0)
        """
        try:
            print("\n\033[1;36m Titan AI\033[0m")
            print("\033[1;37mPrompt:\033[0m", prompt)
            print("\033[1;37mResponse:\033[0m ", end="")
            
            response = self.runtime_client.invoke_model_with_response_stream(
                modelId=self.model_id,
                body=json.dumps({
                    "inputText": prompt,
                    "textGenerationConfig": {
                        "maxTokenCount": max_tokens,
                        "temperature": temperature,
                        "topP": 0.9,
                        "stopSequences": []
                    }
                }),
                contentType='application/json',
                accept='application/json'
            )
            
            full_response = ""
            for event in response['body']:
                chunk = json.loads(event['chunk']['bytes'])
                if 'outputText' in chunk:
                    new_text = chunk['outputText']
                    if new_text:
                        full_response += new_text
                        self._print_with_typing(new_text, delay=0.01)
            
            print("\n\033[1;32m✓ Response complete\033[0m")
            return full_response
                    
        except Exception as e:
            print(f"\n\033[1;31mError in streaming response: {str(e)}\033[0m")
            return None

# Example usage
if __name__ == "__main__":
    client = TitanClient()
    
    # Test streaming generation
    prompt = "Solve the bursting balloons leetcode problem in natural language, do NOT code, just explain the problem and the solution"
    client.generate_stream(prompt)