FROM python:3.12-slim

WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app.py .
COPY .env .

# Set environment variables from .env file
ENV $(cat .env | xargs)

# Run the application
CMD ["python", "app.py"] 