from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

def call_model(input_text):
    # Using TinyLlama - small but modern and open source
    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    
    # Load model and tokenizer with minimal settings
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    
    # Basic prompt format
    prompt = f"<|system|>\nYou are a helpful AI assistant.\n<|user|>\n{input_text}<|assistant|>"
    
    # Tokenize and generate
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=50,  # Keep it minimal
            do_sample=True
        )
    
    response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    input_text = "Will AI replace AI Engineers?"
    output = call_model(input_text)
    print(output)