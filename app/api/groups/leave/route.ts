import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Group from '../../../../models/Groups'; // Import your Group model
import User from '../../../../models/User'; // Import your User model to get user IDs

// Named export for POST method
export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    const { groupId, userEmail } = await request.json();

    if (!groupId || !userEmail) {
      return NextResponse.json({ error: 'Missing groupId or userEmail' }, { status: 400 });
    }

    // Fetch user ID based on email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id.toString(); // Ensure userId is a string

    // Perform database operations to remove the user from the group
    const success = await removeUserFromGroup(groupId, userId);

    if (success) {
      return NextResponse.json({ message: 'Successfully left the group' });
    } else {
      return NextResponse.json({ error: 'Failed to leave the group' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Function to remove a user from a group
async function removeUserFromGroup(groupId: string, userId: string): Promise<boolean> {
  try {
    // Fetch the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      console.error('Group not found:', groupId);
      return false;
    }

    // Log group members before modification
    console.log('Group members before:', group.members);

    // Remove the user from the members array
    const initialLength = group.members.length;
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    
    // Check if the member was actually removed
    if (group.members.length === initialLength) {
      console.error('User not found in group:', userId);
      return false;
    }

    // Save the group document
    await group.save();

    // Log group members after modification
    console.log('Group members after:', group.members);

    return true;
  } catch (error) {
    console.error('Error removing user from group:', error);
    return false;
  }
}
