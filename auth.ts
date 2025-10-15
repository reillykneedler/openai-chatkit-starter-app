import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check against environment variables
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
          console.error("Admin credentials not configured in environment");
          return null;
        }

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          // Return user object for successful authentication
          return {
            id: "admin",
            name: "Admin User",
            email: adminUsername,
          };
        }

        // Return null if authentication fails
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store user profile information in the token after signin
      if (account) {
        // Note: Storing access_token is removed for security - only store if absolutely needed
        token.id = profile?.sub ?? token.sub ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      // Send user id to the client
      if (token && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

