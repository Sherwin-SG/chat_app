import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Group from '../../../../models/Groups';  

export async function POST(req: NextRequest) {
  try {
    await dbConnect();  

    const { name, members } = await req.json();

    // Validate input
    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Create group
    const newGroup = new Group({ name, members });
    await newGroup.save();

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
