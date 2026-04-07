# Skynex Platform: Full-Stack Deployment Guide

Your codebase is now successfully prepared for production! All hardcoded URLs and secrets have been moved to environment variables, and the Python WSGI server config ([Procfile](file:///c:/skin/backend/Procfile)) is ready.

Follow these 3 phases to get your application live on the internet for everyone to use.

## Phase 1: Push Code to GitHub
Before any cloud service can deploy your app, the code needs to live in a GitHub repository.
1. Go to [GitHub](https://github.com) and create TWO separate repositories: `skynex-frontend` and `skynex-backend`.
2. Open your VS Code terminal and push your respective folders to these repositories.

## Phase 2: Deploy Database & Backend (Railway + Render)
Since your backend uses PyTorch (which involves large machine learning models), free tiers on some services might struggle with RAM limits. Render's standard tiers or Railway handle this well.

### 1. Provision a Cloud MySQL Database (Railway App is easiest)
1. Go to [Railway.app](https://railway.app), log in, and click **New Project** -> **Provision MySQL**.
2. Once deployed, click on the MySQL card -> **Variables** tab.
3. Look for the `MYSQL_URL` variable. It will look something like this:
   `mysql://root:password@containers-us-west-113.railway.app:7012/railway`
4. Copy this exact URL (replace `mysql://` with `mysql+pymysql://`). **Save this for later.**

### 2. Deploy the Flask API (Render)
1. Go to [Render](https://render.com), log in, and click **New Web Service**.
2. Connect your GitHub account and select your `skynex-backend` repository.
3. Render will auto-detect Python. Ensure the Start Command is `gunicorn app:app` (or it will automatically read the [Procfile](file:///c:/skin/backend/Procfile) we created!).
4. Add the following **Environment Variables** in the Render dashboard before clicking deploy:
   * **Key**: `DATABASE_URL` -> **Value**: Your mapped Railway DB URL (e.g., `mysql+pymysql://root:password...`)
   * **Key**: `JWT_SECRET_KEY` -> **Value**: A random secret string (e.g., `super_secure_key_8492!`)
5. Click **Deploy Web Service** and wait a few minutes. Render will give you a live URL like `https://skynex-api.onrender.com`. **Copy this URL.**

## Phase 3: Deploy Frontend (Vercel)
Now we deploy the beautiful React UI and tell it how to talk to the live backend.

1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your `skynex-frontend` repository from GitHub.
3. Vercel will automatically detect that you're using Vite. 
4. Before clicking Deploy, expand the **Environment Variables** dropdown.
5. Add the following variable:
   * **Name**: `VITE_API_URL`
   * **Value**: Your Render Backend URL from Phase 2 (e.g., `https://skynex-api.onrender.com`) - *Important: do NOT include a trailing slash `/` at the end of the URL!*
6. Click **Deploy**.

## Testing Your Live App
Once Vercel finishes building (usually < 30 seconds), click the newly generated domain! Your website is now fully public, and when users upload a scan, the frontend will hit the live Render backend, analyze the image with the ML model, and save the result to the cloud MySQL database. 

Congratulations on successfully launching Skynex! 🚀
