import boto3
import json
from smart_open import open
from botocore.client import Config

from urllib.parse import urlparse

# Get the service client with sigv4 configured
s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

def get_presigned_url(s3path):
    bucket_name, object_key = get_bucket_and_prefix(s3path)

    # Generate the URL to get 'key-name' from 'bucket-name'
    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket_name, 'Key': object_key
        }
    )
    #print('presigned: ' + url)
    return url


def get_bucket_and_prefix(path):
    result = urlparse(path, allow_fragments=False)
    return result.netloc, result.path.lstrip("/")

def write_to_path(s3path, data):
    bucket_name, object_key = get_bucket_and_prefix(s3path)
    #s3.put_object(Body=data, Bucket=bucket_name, Key=object_key)
    with open(s3path, "w") as s3File:
        json.dump(data, s3File)