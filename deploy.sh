#!/bin/bash

# This script is for deploying the frontend to Hostinger.
# It assumes that you have already built the frontend and have the `dist` folder.

# 1. Set the variables
HOSTINGER_FTP_USER="your_ftp_user"
HOSTINGER_FTP_PASSWORD="your_ftp_password"
HOSTINGER_FTP_HOST="your_ftp_host"
HOSTINGER_REMOTE_DIR="/public_html"
LOCAL_DIR="./dist"

# 2. Upload the files using FTP
# You can use any FTP client you prefer. Here's an example using `lftp`.
# lftp -c "open -u $HOSTINGER_FTP_USER,$HOSTINGER_FTP_PASSWORD $HOSTINGER_FTP_HOST; mirror -R $LOCAL_DIR $HOSTINGER_REMOTE_DIR"

echo "Frontend deployment script created. Please fill in your Hostinger FTP credentials and run this script to deploy the frontend."
