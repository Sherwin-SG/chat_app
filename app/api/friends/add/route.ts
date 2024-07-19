import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User'; // Adjust the path as needed
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    // Get the JWT token from the request
    const token = await getToken({ req });
    if (!token || !token.email || typeof token.email !== 'string') {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }
    
    // Parse the JSON body of the request
    const { email: friendEmail } = await req.json();

    if (!friendEmail) {
      return NextResponse.json({ message: 'Friend email is required' }, { status: 402 });
    }

    // Find the current user using the email from the token
    const currentUser = await User.findOne({ email: token.email });
    if (!currentUser) {
      return NextResponse.json({ message: 'Current user not found' }, { status: 403 });
    }

    // Find the user to be added as a friend
    const userToAdd = await User.findOne({ email: friendEmail });
    if (!userToAdd) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the current user is already friends with the userToAdd
    if (currentUser.friends.includes(userToAdd._id)) {
      return NextResponse.json({ message: 'Already friends' }, { status: 405 });
    }

    // Add the friend to both users' friend lists
    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { friends: userToAdd._id } }
    );

    await User.updateOne(
      { _id: userToAdd._id },
      { $addToSet: { friends: currentUser._id } }
    );

    return NextResponse.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
