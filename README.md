# Frontend Deployment

This guide explains how to deploy the frontend of your project to Hostinger.

## Prerequisites

- A Hostinger account with a domain name.
- FTP credentials for your Hostinger account.

## Steps

1.  **Build the frontend:**

    ```bash
    npm run build
    ```

2.  **Fill in your Hostinger FTP credentials in `deploy.sh`:**

    Open the `deploy.sh` file and replace the placeholder values for `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`, and `HOSTINGER_FTP_HOST` with your actual FTP credentials.

3.  **Run the deployment script:**

    ```bash
    ./deploy.sh
    ```

    This will upload the contents of the `dist` folder to your Hostinger account.

4.  **Configure your domain:**

    In your Hostinger control panel, make sure your domain is pointing to the `public_html` directory (or the directory where you uploaded the files).

## Backend Deployment

Once the frontend is deployed, you will need to deploy the backend and connect it to the frontend. The steps for this will depend on the backend technology you are using. Please provide the backend project so that I can provide you with further instructions.
