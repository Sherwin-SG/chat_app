// app/api/groups/members/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { memberIds } = await request.json();
    // Fetch user emails based on member IDs
    const members = await User.find({ _id: { $in: memberIds } }).select('email');
    const memberEmails = members.map(member => member.email);

    return NextResponse.json({ memberEmails });
  } catch (error) {
    console.error('Error fetching member emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
