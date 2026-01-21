# Frontend Deployment

This guide explains how to deploy the frontend of your project to an AWS instance.

## Prerequisites

- An AWS account with an EC2 instance.
- A domain name from Hostinger.
- A PEM file for connecting to your EC2 instance.

## Steps

1.  **Configure your Hostinger domain:**

    In your Hostinger control panel, find the DNS settings for your domain and create an "A" record that points your domain to the public IP address of your AWS EC2 instance.

2.  **Set up a web server on your AWS instance:**

    Connect to your EC2 instance and install a web server like Nginx or Apache. Configure the web server to serve files from the `/var/www/html` directory.

3.  **Build the frontend:**

    ```bash
    npm run build
    ```

4.  **Fill in your AWS instance details in `deploy.sh`:**

    Open the `deploy.sh` file and replace the placeholder values for `AWS_INSTANCE_IP`, `AWS_INSTANCE_USER`, and `AWS_PEM_FILE` with your actual AWS instance details.

5.  **Run the deployment script:**

    ```bash
    ./deploy.sh
    ```

    This will upload the contents of the `dist` folder to your AWS instance.

## Backend Deployment

Once the frontend is deployed, you will need to connect it to your API Gateway. Please provide your API Gateway endpoint so that I can provide you with further instructions.