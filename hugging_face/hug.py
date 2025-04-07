from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os

# Global variables for model and tokenizer
model = None
tokenizer = None

def initialize_model():
    global model, tokenizer
    
    if model is not None and tokenizer is not None:
        return
        
    try:
        print("Loading model...")
        model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        
        # Configure model loading with lower memory usage
        model_kwargs = {
            "torch_dtype": torch.float16,
            "device_map": "auto",
            "low_cpu_mem_usage": True,
        }
        
        # Load tokenizer first
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            use_fast=True
        )
        
        # Load model with optimized settings
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            **model_kwargs
        )
        
        print("Model loaded successfully!")
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise

def call_model(input_text):
    global model, tokenizer
    
    try:
        # Initialize model if not already done
        if model is None or tokenizer is None:
            initialize_model()
        
        # Basic prompt format
        prompt = f"<|system|>\nYou are a helpful AI assistant.\n<|user|>\n{input_text}<|assistant|>"
        
        # Tokenize with proper padding and truncation
        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        ).to(model.device)
        
        # Generate with proper error handling
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=50,
                do_sample=True,
                temperature=0.7,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id,
            )
        
        response = tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:],
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True
        )
        return response.strip()
        
    except Exception as e:
        print(f"Error during model inference: {str(e)}")
        return f"Error processing request: {str(e)}"

if __name__ == "__main__":
    try:
        input_text = "Will AI replace AI Engineers?"
        output = call_model(input_text)
        print(f"Model response: {output}")
    except Exception as e:
        print(f"Error in main: {str(e)}")
    
    # If you're running this in a Docker container, you can see the output by:
    # 1. Running: docker logs <container_id>
    # 2. Or attaching to the container with: docker attach <container_id>
    # 3. Or using the -it flags when starting: docker run -it <image_name>