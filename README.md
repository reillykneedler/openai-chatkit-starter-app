# ChatKit Starter Template

This repository is the simplest way to bootstrap a [ChatKit](http://openai.github.io/chatkit-js/) application. It ships with a minimal Next.js UI, the ChatKit web component, Google OAuth authentication, and a ready-to-use session endpoint so you can experiment with OpenAI-hosted workflows built using [Agent Builder](https://platform.openai.com/agent-builder).

## What You Get

- Next.js app with `<openai-chatkit>` web component and theming controls
- **Google OAuth authentication via NextAuth.js**
- **PostgreSQL database with Prisma ORM for session persistence**
- **User-specific chat history and session management**
- API endpoint for creating a session at [`app/api/create-session/route.ts`](app/api/create-session/route.ts)
- Quick examples for starter prompts, placeholder text, and greeting message

## Getting Started

Follow every step below to run the app locally and configure it for your preferred backend.

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PostgreSQL and Google OAuth

**Important:** This app now requires authentication and a database.

Follow the detailed setup guide: **[SETUP_AUTH.md](SETUP_AUTH.md)**

Quick summary:
1. Create a PostgreSQL database (local or cloud)
2. Set up Google OAuth in Google Cloud Console
3. Create `.env.local` with required environment variables

### 3. Configure environment variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI ChatKit
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your_workflow_id

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chatkit_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

See [SETUP_AUTH.md](SETUP_AUTH.md) for detailed instructions.

### 4. Run database migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google. After authentication, you can start chatting with your AI assistants. Your chat history will be automatically saved and tied to your account.

### 6. Build for production (optional)

```bash
npm run build
npm start
```

## Features

- **User Authentication**: Google OAuth integration with NextAuth.js
- **Session Persistence**: Chat sessions are stored in PostgreSQL and tied to user accounts
- **Chat History**: View and resume previous conversations from the `/chats` page
- **Multiple Assistants**: Define multiple chatbots in [`lib/chatbots.ts`](lib/chatbots.ts)
- **Protected Routes**: Chat pages require authentication via middleware

## Customization Tips

- Adjust starter prompts, greeting text, and placeholder copy in [`lib/config.ts`](lib/config.ts)
- Add or modify chatbots in [`lib/chatbots.ts`](lib/chatbots.ts)
- Update the theme defaults or event handlers inside [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx) to integrate with your product analytics or storage
- Customize authentication pages in [`app/auth/signin/page.tsx`](app/auth/signin/page.tsx)
- Modify the database schema in [`prisma/schema.prisma`](prisma/schema.prisma) (remember to run migrations after changes)

## Database Management

View and manage your database with Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555`.

## References

- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
