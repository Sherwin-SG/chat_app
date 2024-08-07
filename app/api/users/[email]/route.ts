import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'; // Adjust path if needed
import User from '../../../../models/User'; // Adjust path if needed

// Fetch user ID by email
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email }).select('_id'); // Ensure _id is returned
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ id: user._id.toString() }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
