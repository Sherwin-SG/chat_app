import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import User from '@/models/User'; // Adjust the path to your User model
import bcrypt from 'bcryptjs';

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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URI!); // Connect to MongoDB
        
        const user = await User.findOne({ email: credentials?.email });
        if (user && await bcrypt.compare(credentials?.password!, user.password)) {
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        return null; // Return null if credentials are invalid
      },
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
      if (account) {
        if (account.provider === 'credentials') {
          // Credentials provider handled in authorize function
          return true;
        }
      }

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
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
