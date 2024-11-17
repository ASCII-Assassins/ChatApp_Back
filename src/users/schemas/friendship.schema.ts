import mongoose, { Schema, Document } from 'mongoose';

export interface Friendship extends Document {
  userId: Schema.Types.ObjectId;
  friendId: Schema.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const friendshipSchema = new Schema<Friendship>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  friendId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<Friendship>('Friendship', friendshipSchema);
