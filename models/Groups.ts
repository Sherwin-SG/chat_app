// models/Group.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGroup extends Document {
  name: string;
  members: string[];
  description?: string; // Optional description field
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  description: { type: String, default: '' }, // Add the description field
});

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);

export default Group;
