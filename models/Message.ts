import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  content: string;
  senderEmail: string;
  receiverEmail: string;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

// Avoid overwriting the model if it already exists
const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
