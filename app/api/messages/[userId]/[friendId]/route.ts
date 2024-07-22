// app/api/messages/[userId]/[friendId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Message from '@/models/Message'; // Adjust the path as needed
import { getToken } from 'next-auth/jwt';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
};

export async function GET(req: NextRequest, { params }: { params: { userId: string; friendId: string } }) {
  try {
    await connectToDatabase();

    const { userId, friendId } = params;
    const messages = await Message.find({
      $or: [
        { senderEmail: userId, receiverEmail: friendId },
        { senderEmail: friendId, receiverEmail: userId }
      ]
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string; friendId: string } }) {
  try {
    await connectToDatabase();

    const token = await getToken({ req });
    if (!token || !token.email || token.email !== params.userId) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const { content } = await req.json();
    const newMessage = new Message({
      senderEmail: params.userId,
      receiverEmail: params.friendId,
      content,
      createdAt: new Date()
    });
    await newMessage.save();

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
