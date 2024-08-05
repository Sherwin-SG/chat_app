import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import {GroupMessage} from '../../../../../models/GroupMessage';

export async function POST(req: NextRequest) {
  const { groupId, senderEmail, content } = await req.json();

  try {
    await dbConnect();
    const message = new GroupMessage({ groupId, senderEmail, content });
    await message.save();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending group message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
