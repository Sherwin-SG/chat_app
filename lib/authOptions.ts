import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import User from '@/models/User'; 
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
        await mongoose.connect(process.env.MONGO_URI!); 
        
        const user = await User.findOne({ email: credentials?.email });
        if (user && await bcrypt.compare(credentials?.password!, user.password)) {
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        return null; 
      },
    }),
  ],
  session: {
    strategy: 'jwt', 
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
      await mongoose.connect(process.env.MONGO_URI!); 

       
      if (account) {
        if (account.provider === 'credentials') {
           
          return true;
        }
      }

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email!,
          name: user.name || '',
          friends: [],  
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
       
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;  
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',  
  },
};

export default NextAuth(authOptions);
