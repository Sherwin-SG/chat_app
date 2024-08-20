import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  content: string;
  senderEmail: string;
  receiverEmail: string;
  status: string; 
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  status: { type: String, required: true, default: 'sent' }, 
}, {
  timestamps: true, 
});


const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
