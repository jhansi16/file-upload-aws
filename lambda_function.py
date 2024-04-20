import json
import boto3
from boto3.dynamodb.types import TypeDeserializer

def parse_dynamodb_event(event):
    print(event['dynamodb'])
    print(event['dynamodb']['Keys'])
    return event['dynamodb']['Keys']

    
def process_insert_event(event):
    print(event)
    ec2_client = boto3.client('ec2', region_name='us-east-1')  # Specify your region
    event_data = json.dumps(parse_dynamodb_event(event))
    
    user_data_script = f"""#!/bin/bash
    echo "hello world"
    sudo yum update -y
    sudo yum install -y python3
    echo "installed python"
    echo '{event_data}' > /home/ec2-user/event-data.txt
    echo "saved input file"
    aws s3 cp s3://jhansi-scripts/execute.py /home/ec2-user/execute.py
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install boto3
    python3 -m pip install nanoid
    python3 /home/ec2-user/execute.py
    sudo shutdown -h now
    """
    
    print(user_data_script)
    
    instance = ec2_client.run_instances(
        ImageId='ami-051f8a213df8bc089',  # Choose the appropriate AMI for your region and needs
        InstanceType='t2.micro',
        MinCount=1,
        MaxCount=1,
        UserData=user_data_script,
        IamInstanceProfile={
            'Name': 'CustomEC2RoleWithS3Access'  # Ensure this role has permissions to access S3 and perform necessary actions
        },
        KeyName='ec2-key-pari-2'  # Specify your key pair for SSH access
    )

    print(f"Launched EC2 instance with ID: {instance['Instances'][0]['InstanceId']}")
    
    

def lambda_handler(records, context):
    print(records)
    events = records['Records']
    for event in events:
        event_s = json.dumps(event)
        if "undefined" in event_s:
            print(f"Skipping {event}")
        else:
            print(event)
            if event['eventName'] == "INSERT":
                process_insert_event(event)
            else:
                print(f"Skipping event {event}")
    