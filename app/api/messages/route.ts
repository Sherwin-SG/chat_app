import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../../models/Message';
import User from '../../../models/User'; 
import dbConnect from '../../../lib/dbConnect';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const { userEmail, friendEmail, content } = req.body;

  try {
    // Find user IDs from emails
    const sender = await User.findOne({ email: userEmail });
    const receiver = await User.findOne({ email: friendEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    const message = new Message({
      content,
      sender: sender._id,
      receiver: receiver._id,
    });

    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};
