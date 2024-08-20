import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Group from '../../../../models/Groups';  

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); 

    const groups = await Group.find({});
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
