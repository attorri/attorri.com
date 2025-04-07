import sagemaker
import boto3
from sagemaker.huggingface import HuggingFace

def train_model():
    
    try:
        role = sagemaker.get_execution_role()
    except ValueError:
        iam = boto3.client('iam')
        role = iam.get_role(RoleName='sagemaker_execution_role')['Role']['Arn']
        
    bucket = 'sagemaker-us-east-1-123456789012' # Replace with your own bucket
    hyperparams = {
        'model_name_or_path': 'Qwen/Qwen2.5-Omni-7b',
        'output_dir': 's3://{}/output'.format(bucket),
        'max_seq_length': 1024,
        'max_steps': 100,
        'per_device_train_batch_size': 1,
        'per_device_eval_batch_size': 1,
        'learning_rate': 2e-5,
        
    }

    git_config = { 'repo': 'https://github.com/huggingface/transformers.git',
                'branch': 'v4.37.0'
    }

    huggingface_estimator = HuggingFace(
        entry_point='trainer.py',
        source_dir='./trainer', # Path to the directory containing the trainer.py file
        instance_type='ml.g5.2xlarge',
        instance_count=1,
        role=role,
        git_config=git_config,
        transformers_version='4.37.0',
        hyperparameters=hyperparams,
        pytorch_version='2.1.0',
        py_version='py310',
    )

    huggingface_estimator.fit()

if __name__ == "__main__":
    train_model()

