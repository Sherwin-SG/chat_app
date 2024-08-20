import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Message from '@/models/Message';  

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const messages = await Message.find({
      receiverEmail: userId,
      status: 'sent',
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
