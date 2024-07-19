import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import mongoose from 'mongoose';
import User from '@/models/User'; // Adjust the path to your User model

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
      };
      return session;
    },
    async signIn({ user, account }) {
      await mongoose.connect(process.env.MONGO_URI!); // Connect to MongoDB

      // Check if the user exists in the database
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create a new user if they don't exist
        await User.create({
          email: user.email!,
          name: user.name || '',
          friends: [], // Initialize with an empty array if needed
          // No password needed for OAuth users
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the dashboard after successful login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`; // Redirect to the dashboard
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', // Redirect to your custom login page
  },
};

export default NextAuth(authOptions);
