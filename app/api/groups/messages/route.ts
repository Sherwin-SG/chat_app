import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import {GroupMessage} from '../../../../models/GroupMessage';

export async function POST(req: NextRequest) {
  const { groupId, senderEmail, content } = await req.json();

  console.log('Received message data:', { groupId, senderEmail, content }); // Add this line

  if (!groupId || !senderEmail || !content) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await dbConnect();
    const message = new GroupMessage({ groupId, senderEmail, content }); // Correctly map content to message
    await message.save();

    // Emit the new message via socket.io
    const io = require('socket.io')(process.env.SOCKET_SERVER_PORT);
    io.to(groupId).emit('group-message', message);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending group message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  try {
    await dbConnect();
    const messages = await GroupMessage.find({ groupId }).sort({ createdAt: 1 });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching group messages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
