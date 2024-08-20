import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';  
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    
    const token = await getToken({ req });
    if (!token || !token.email || typeof token.email !== 'string') {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }
    
     
    const { email: friendEmail } = await req.json();

    if (!friendEmail) {
      return NextResponse.json({ message: 'Friend email is required' }, { status: 402 });
    }

     
    const currentUser = await User.findOne({ email: token.email });
    if (!currentUser) {
      return NextResponse.json({ message: 'Current user not found' }, { status: 403 });
    }

     
    const userToAdd = await User.findOne({ email: friendEmail });
    if (!userToAdd) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

     
    if (currentUser.friends.includes(userToAdd._id)) {
      return NextResponse.json({ message: 'Already friends' }, { status: 405 });
    }

     
    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { friends: userToAdd._id } }
    );

    await User.updateOne(
      { _id: userToAdd._id },
      { $addToSet: { friends: currentUser._id } }
    );

    return NextResponse.json({ message: 'Friend added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
