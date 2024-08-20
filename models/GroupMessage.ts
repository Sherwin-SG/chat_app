import mongoose, { Schema, Document } from 'mongoose';

interface IGroupMessage extends Document {
  groupId: string;
  senderEmail: string;
  content: string;
  createdAt: Date;
  updatedAt: Date; 
}

const GroupMessageSchema: Schema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  senderEmail: { type: String, required: true },
  content: { type: String, required: true } 
}, {
  timestamps: true 
});


const GroupMessage = mongoose.models.GroupMessage || mongoose.model<IGroupMessage>('GroupMessage', GroupMessageSchema);

export { GroupMessage };
