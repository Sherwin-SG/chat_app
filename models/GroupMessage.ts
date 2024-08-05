import mongoose, { Schema, Document } from 'mongoose';

interface IGroupMessage extends Document {
  groupId: string;
  senderEmail: string;
  content: string;
  createdAt: Date;
  updatedAt: Date; // Add updatedAt field to the interface
}

const GroupMessageSchema: Schema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  senderEmail: { type: String, required: true },
  content: { type: String, required: true } // Ensure this field is required
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Check if the model already exists before defining it
const GroupMessage = mongoose.models.GroupMessage || mongoose.model<IGroupMessage>('GroupMessage', GroupMessageSchema);

export { GroupMessage };
