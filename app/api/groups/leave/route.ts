import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Group from '../../../../models/Groups';  
import User from '../../../../models/User';  

 
export async function POST(request: NextRequest) {
  try {
    await dbConnect();  

    const { groupId, userEmail } = await request.json();

    if (!groupId || !userEmail) {
      return NextResponse.json({ error: 'Missing groupId or userEmail' }, { status: 400 });
    }

    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id.toString();  

    
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

 
async function removeUserFromGroup(groupId: string, userId: string): Promise<boolean> {
  try {
     
    const group = await Group.findById(groupId);

    if (!group) {
      console.error('Group not found:', groupId);
      return false;
    }

    
    console.log('Group members before:', group.members);

     
    const initialLength = group.members.length;
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    
     
    if (group.members.length === initialLength) {
      console.error('User not found in group:', userId);
      return false;
    }

     
    await group.save();

     
    console.log('Group members after:', group.members);

    return true;
  } catch (error) {
    console.error('Error removing user from group:', error);
    return false;
  }
}
