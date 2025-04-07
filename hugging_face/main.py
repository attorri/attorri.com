from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

# Load the DeepSeek V3 model and tokenizer
model_name = "Qwen/QwQ-32B"

# Initialize tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Initialize model with CPU-optimized settings
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float32,  # Use full precision for CPU
    device_map="cpu",           # Force CPU usage
    low_cpu_mem_usage=True,     # Optimize for lower memory usage
    offload_folder="offload"    # Folder for offloading weights if needed
)

# Prepare input text
input_text = "Hello, how are you?"
inputs = tokenizer(input_text, return_tensors="pt")

# Generate response
with torch.no_grad():
    output = model.generate(
        **inputs,
        max_length=100,
        num_return_sequences=1,
        temperature=0.7,
        do_sample=True
    )

# Decode and print the response
response = tokenizer.decode(output[0], skip_special_tokens=True)
print(response)