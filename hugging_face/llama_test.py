from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import PromptTemplate

model = pipeline("text-generation", 
                 model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",  # Open-access alternative
                 device=0,
                 max_length=256,
                 truncation=True)

llm = HuggingFacePipeline(pipeline=model, model_kwargs={'temperature': 0.9, 'repetition_penalty': 1.23})

template = PromptTemplate.from_template("""<|system|>You are a helpful AI assistant that explains concepts clearly.<|system|>
<|user|>Explain {topic} for a {age} year old to understand<|user|>
<|assistant|>""")

chain = template | llm

topic = input("Enter a topic: ")
age = input("Enter an age: ")

response = (chain.invoke({"topic": topic, "age": age}))
print(response)

