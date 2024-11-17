import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  onlineStatus: boolean;  // Statut en ligne
  friends: Schema.Types.ObjectId[]; // Liste des amis
  friendRequestsSent: Schema.Types.ObjectId[]; // Liste des demandes envoyées
  friendRequestsReceived: Schema.Types.ObjectId[]; // Liste des demandes reçues
  createdAt: Date;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  onlineStatus: { type: Boolean, default: false }, // Par défaut, hors ligne
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<User>('User', userSchema);
