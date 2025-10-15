# Google Authentication Setup Guide

This application uses NextAuth.js v5 with Google OAuth for authentication. All routes are protected and require users to sign in with their Google account.

## Prerequisites

- A Google Cloud Console account
- Access to create OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (app name, user support email, developer contact)
   - Add scopes: `email`, `profile`, `openid` (these are default)
   - Add test users if needed during development
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Your app name (e.g., "Wick AI Toolkit")
   - Authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret** (you'll need these for the next step)

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Existing OpenAI Configuration (keep your existing values)
OPENAI_API_KEY=your-existing-openai-key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your-existing-workflow-id
```

### Generating NEXTAUTH_SECRET

Generate a secure random string for `NEXTAUTH_SECRET` using one of these methods:

**Option 1: Using OpenSSL (Mac/Linux)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/32

Copy the generated string and use it as your `NEXTAUTH_SECRET` value.

### Production Environment Variables

For production deployment, update `NEXTAUTH_URL` to your actual domain:

```env
NEXTAUTH_URL=https://yourdomain.com
```

And make sure to add the production callback URL to your Google OAuth credentials:
```
https://yourdomain.com/api/auth/callback/google
```

## Step 3: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. You should see a sign-in page with a "Sign in with Google" button

4. Click the button and complete the Google OAuth flow

5. Once authenticated, you'll have access to the full application

## Features Implemented

✅ **Protected Routes**: All pages require authentication
✅ **Google OAuth**: Secure sign-in with Google accounts
✅ **Session Management**: JWT-based sessions (no database required)
✅ **Sign Out**: Users can sign out using the button in the top-right corner
✅ **Beautiful UI**: Custom-designed sign-in page matching your app's aesthetic

## Troubleshooting

### "Error: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET"
- Make sure you've created the `.env.local` file in the project root
- Verify that the environment variable names are correct
- Restart your development server after adding environment variables

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for typos and trailing slashes

### "Invalid client secret" error
- Verify you copied the correct Client Secret from Google Cloud Console
- Try regenerating the client secret in Google Cloud Console

### Session not persisting
- Make sure `NEXTAUTH_SECRET` is set and is a sufficiently long random string
- Clear your browser cookies and try again

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Keep your `GOOGLE_CLIENT_SECRET` and `NEXTAUTH_SECRET` private
- Use different OAuth credentials for development and production
- Regularly rotate your secrets in production environments

## Additional Configuration

If you need to customize the authentication behavior, edit the `/auth.ts` file in the project root. This file contains:
- OAuth provider configuration
- Session strategy settings
- JWT and session callbacks
- Custom sign-in page routing

