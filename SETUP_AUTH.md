# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication and PostgreSQL database for the ChatKit application.

## Prerequisites

- PostgreSQL database (local or cloud-hosted)
- Google Cloud Console account
- Node.js and npm installed

## Step 1: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine if you haven't already
2. Create a new database:
   ```bash
   createdb chatkit_db
   ```
3. Your DATABASE_URL will be:
   ```
   postgresql://username:password@localhost:5432/chatkit_db
   ```

### Option B: Cloud PostgreSQL (Recommended for Production)

Popular options:
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Serverless PostgreSQL)
- [Railway](https://railway.app)
- [Heroku Postgres](https://www.heroku.com/postgres)

Follow your chosen provider's instructions to create a database and get your connection string.

## Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL (e.g., `https://yourdomain.com`)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"
5. Copy the Client ID and Client Secret

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI ChatKit Configuration
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your_workflow_id_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/chatkit_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_from_step_2
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_step_2
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Run Database Migrations

Generate and run Prisma migrations to create the database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init
```

This will create all necessary tables: users, accounts, sessions, verification_tokens, and chat_sessions.

## Step 5: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see the sign-in page.

## Step 6: Test Authentication

1. Click "Sign In with Google"
2. Authenticate with your Google account
3. You should be redirected back to the app
4. You can now create and manage chat sessions

## Database Schema

The application uses the following database models:

- **User**: Stores user information from Google OAuth
- **Account**: Stores OAuth provider data (Google)
- **Session**: Stores NextAuth sessions
- **ChatSession**: Stores chat session metadata (chatbot ID, timestamps)
- **VerificationToken**: Used for email verification (if implemented)

## Troubleshooting

### "Invalid client" error

- Verify your Google OAuth credentials are correct
- Ensure redirect URIs match exactly (including http/https and trailing slashes)

### Database connection errors

- Check your DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database credentials and permissions

### NextAuth errors

- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your application URL

### Prisma errors

- Run `npx prisma generate` to regenerate the Prisma Client
- Run `npx prisma migrate reset` to reset the database (warning: deletes all data)

## Production Deployment

When deploying to production:

1. Update NEXTAUTH_URL to your production URL
2. Update Google OAuth redirect URIs to include production URL
3. Use a secure DATABASE_URL from your cloud database provider
4. Generate a new NEXTAUTH_SECRET for production
5. Set all environment variables in your hosting platform (Vercel, Railway, etc.)

## Viewing the Database

You can use Prisma Studio to view and manage your database:

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your data.

