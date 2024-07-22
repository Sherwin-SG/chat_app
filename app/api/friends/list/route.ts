import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const token = await getToken({ req });
    if (!token || !token.email || typeof token.email !== 'string') {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const currentUser = await User.findOne({ email: token.email }).populate('friends');
    if (!currentUser) {
      return NextResponse.json({ message: 'Current user not found' }, { status: 403 });
    }

    return NextResponse.json({ friends: currentUser.friends }, { status: 200 });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
