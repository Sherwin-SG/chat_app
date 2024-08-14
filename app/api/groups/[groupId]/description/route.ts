import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Group from '../../../../../models/Groups';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { pathname } = req.nextUrl;
  const groupId = pathname.split('/')[3]; // Extract groupId from the URL
  const { description } = await req.json();

  if (!description) {
    return NextResponse.json({ message: 'Description is required' }, { status: 400 });
  }

  console.log(`Updating group with ID: ${groupId}`);
  console.log(`New description: ${description}`);

  try {
    // Find the group by ID and update the description
    const group = await Group.findByIdAndUpdate(groupId, { $set: { description } }, { new: true });

    if (!group) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    console.log('Group updated:', group);
    return NextResponse.json({ group });
  } catch (error) {
    console.error('Error updating description:', error);
    return NextResponse.json({ message: 'Failed to update description' }, { status: 500 });
  }
}
