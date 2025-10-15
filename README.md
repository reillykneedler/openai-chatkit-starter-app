# Wick AI Toolkit

A sophisticated multi-chatbot AI platform built with OpenAI ChatKit, featuring specialized AI assistants for advertising, newsroom, and general-purpose tasks. The toolkit provides an elegant, modern interface with authentication, intelligent routing, and extensible chatbot configurations.

![Alpha Release](https://img.shields.io/badge/status-alpha-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🤖 **Multi-Assistant Platform**
- **Specialized AI Assistants**: Pre-configured chatbots for specific use cases
- **Category Organization**: Tools organized by department (Advertising, Newsroom, General)
- **Dynamic Routing**: Each assistant has its own dedicated chat interface
- **Custom Workflows**: Individual OpenAI workflow IDs per assistant

### 🎨 **Beautiful Modern UI**
- **Glass-morphic Design**: Modern, elegant interface with backdrop blur effects
- **Dark Mode Support**: Seamless dark/light theme switching
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Fade-in, slide-up, and hover effects throughout
- **Loading States**: Skeleton screens and loading indicators for better UX

### 🔐 **Enterprise Authentication**
- **Google OAuth**: Sign in with Google accounts via NextAuth.js v5
- **Admin Credentials**: Alternative credentials-based login for admin users
- **Session Management**: JWT-based secure session handling
- **Protected Routes**: All pages require authentication

### 🚀 **Current AI Assistants**

#### Advertising Tools
- **Prospect Research** 🔬 - Research prospective clients and generate business analysis
- **Objections Coach** 🎯 - Master handling customer objections with strategic responses
- **Campaign Builder** 🚀 *(In Development)* - Design comprehensive advertising campaigns
- **Customer Needs Analysis** 🔍 *(In Development)* - Unlock customer insights and pain points

#### Newsroom Tools
- **Press Release Rewriter** 📝 *(In Development)* - Transform press releases into compelling narratives

#### General Tools
- **General Assistant** 💬 - Helpful AI for questions and general tasks

## 🏗️ Technology Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) with App Router
- **Frontend**: [React 19.2](https://react.dev/) with TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom animations
- **AI Integration**: [OpenAI ChatKit](https://openai.github.io/chatkit-js/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/) (beta)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: Optimized for [Vercel](https://vercel.com)

## 📋 Prerequisites

- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **OpenAI Account**: Access to OpenAI ChatKit and workflow IDs
- **Google Cloud Console**: For OAuth credentials (or admin credentials)

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd openai-chatkit-starter-app-main

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI ChatKit Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your_default_workflow_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key

# Google OAuth (Primary Authentication)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Credentials (Alternative Authentication)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

#### Generating Secure Keys

**NEXTAUTH_SECRET**:
```bash
# Option 1: Using OpenSSL (Mac/Linux)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Google OAuth Setup**:
See the detailed guide in [AUTH_SETUP.md](AUTH_SETUP.md) for configuring Google OAuth credentials.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be prompted to sign in with Google or admin credentials.

### 4. Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth.js API routes
│   │   └── create-session/         # ChatKit session creation endpoint
│   ├── chat/[id]/                  # Dynamic chat pages for each assistant
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Homepage with assistant selection
│   └── globals.css                 # Global styles and animations
├── components/
│   ├── AuthWrapper.tsx             # Authentication wrapper component
│   ├── ChatKitPanel.tsx            # Main ChatKit integration component
│   ├── ErrorBoundary.tsx           # Error boundary for graceful failures
│   ├── ErrorOverlay.tsx            # Error display overlay
│   └── SessionProvider.tsx         # NextAuth session provider wrapper
├── lib/
│   ├── chatbots.ts                 # Chatbot definitions and configuration
│   ├── config.ts                   # App-wide configuration
│   └── errors.ts                   # Error handling utilities
├── hooks/
│   └── useColorScheme.ts           # Dark mode detection hook
├── auth.ts                         # NextAuth.js configuration
└── package.json                    # Dependencies and scripts
```

## 🎨 Customization Guide

### Adding New AI Assistants

Edit `lib/chatbots.ts`:

```typescript
export const CHATBOTS: Chatbot[] = [
  {
    id: "your-bot-id",
    name: "Your Bot Name",
    description: "Detailed description of what this bot does",
    icon: "🤖", // Emoji icon
    color: "bg-blue-500", // Tailwind color class
    category: "Your Category",
    workflowId: "wf_your_specific_workflow_id",
    greeting: "Custom greeting message",
    inDevelopment: false, // Set to true to disable
  },
  // ... other bots
];
```

### Customizing UI Theme

The app uses a custom color scheme. Main colors are configured in:
- `app/globals.css` - Global CSS variables and animations
- `components/ChatKitPanel.tsx` - ChatKit theme configuration
- Tailwind classes throughout components

### Modifying Starter Prompts

Edit `lib/config.ts`:

```typescript
export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Display text",
    prompt: "Actual prompt sent to AI",
    icon: "circle-question", // Font Awesome icon name
  },
];

export const GREETING = "Your custom greeting message";
export const PLACEHOLDER_INPUT = "Your placeholder text...";
```

### Configuring Authentication Providers

Edit `auth.ts` to add/remove authentication providers:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({ /* config */ }),
    Credentials({ /* config */ }),
    // Add more providers here
  ],
  // ... other config
});
```

## 🔧 API Endpoints

### POST `/api/create-session`

Creates a new ChatKit session for a specific workflow.

**Request Body**:
```json
{
  "workflow": {
    "id": "wf_your_workflow_id"
  }
}
```

**Response**:
```json
{
  "client_secret": "cs_your_session_token"
}
```

## 🐛 Troubleshooting

### Common Issues

**"Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET"**
- Ensure `.env.local` exists in the project root
- Verify environment variable names are correct
- Restart the development server after adding variables

**"Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local"**
- Add a valid OpenAI workflow ID to `.env.local`
- Each chatbot can override this with its own `workflowId`

**ChatKit fails to load**
- Check that `OPENAI_API_KEY` is valid
- Verify workflow IDs are correct and accessible
- Check browser console for detailed error messages

**Authentication redirect issues**
- Ensure `NEXTAUTH_URL` matches your current domain
- For production, update Google OAuth authorized redirect URIs

### Debug Mode

The app includes development logging. Check the browser console for:
- `[DEBUG]` prefixed messages for configuration
- `[ChatKitPanel]` prefixed messages for ChatKit events
- `[ChatPage]` prefixed messages for page-level actions

## 📊 Analytics

The app includes Vercel Analytics for tracking:
- Page views
- User interactions
- Performance metrics

Analytics are automatically enabled when deployed to Vercel.

## 🚢 Deployment

### Deploying to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - Add all `.env.local` variables to Vercel project settings
   - Update `NEXTAUTH_URL` to your production domain
   - Add production OAuth redirect URI to Google Cloud Console

4. **Deploy**:
   - Vercel will automatically deploy on every push to main

### Deploying to Other Platforms

The app can be deployed to any platform that supports Node.js:
- AWS (EC2, Elastic Beanstalk, Amplify)
- Google Cloud Platform (App Engine, Cloud Run)
- Azure (App Service)
- DigitalOcean App Platform
- Railway, Render, Fly.io

See Next.js [deployment documentation](https://nextjs.org/docs/deployment) for platform-specific guides.

## 🔒 Security Considerations

- **Never commit `.env.local`** - It's in `.gitignore` by default
- **Rotate secrets regularly** in production environments
- **Use different OAuth credentials** for development and production
- **Implement rate limiting** for API endpoints in production
- **Review and audit** authentication flows regularly
- **Keep dependencies updated** - Run `npm audit` regularly

## 📝 Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check for linting issues
npm run lint

# Build for production
npm run build

# Start production server locally
npm start
```

## 🤝 Contributing

When adding new features:
1. Follow the existing code structure and naming conventions
2. Add TypeScript types for new components and functions
3. Test authentication flows thoroughly
4. Update this README if adding new configuration options
5. Ensure responsive design on all screen sizes

## 📚 Additional Documentation

- [AUTH_SETUP.md](AUTH_SETUP.md) - Detailed Google OAuth setup guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical implementation details
- [RESPONSE_DEBUGGING_GUIDE.md](RESPONSE_DEBUGGING_GUIDE.md) - Debugging ChatKit responses
- [WORKFLOW_DEBUG.md](WORKFLOW_DEBUG.md) - Workflow debugging tips

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI ChatKit](https://openai.github.io/chatkit-js/) for the AI chat infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Vercel](https://vercel.com) for hosting and analytics

## 📞 Support

For issues related to:
- **OpenAI ChatKit**: [ChatKit Documentation](https://openai.github.io/chatkit-js/)
- **NextAuth.js**: [NextAuth.js Documentation](https://next-auth.js.org/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ for powerful work.**
