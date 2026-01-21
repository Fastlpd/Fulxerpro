#!/bin/bash

# This script is for deploying the frontend to an AWS instance.
# It assumes that you have already built the frontend and have the `dist` folder.

# 1. Set the variables
AWS_INSTANCE_IP="your_aws_instance_ip"
AWS_INSTANCE_USER="your_aws_instance_user"
AWS_PEM_FILE="your_pem_file.pem"
REMOTE_DIR="/var/www/html"
LOCAL_DIR="./dist"

# 2. Upload the files using scp
# Make sure you have the correct permissions for the PEM file (chmod 400 your_pem_file.pem)
scp -i $AWS_PEM_FILE -r $LOCAL_DIR/* $AWS_INSTANCE_USER@$AWS_INSTANCE_IP:$REMOTE_DIR

echo "Frontend deployment script created. Please fill in your AWS instance details and run this script to deploy the frontend."