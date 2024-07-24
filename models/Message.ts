import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  content: string;
  senderEmail: string;
  receiverEmail: string;
  status: string; // Added field
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  status: { type: String, required: true, default: 'sent' }, // Added field with default value
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

// Avoid overwriting the model if it already exists
const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
