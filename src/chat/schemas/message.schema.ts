import mongoose,{ Schema, Document } from 'mongoose';

export interface Message extends Document {
  senderId: Schema.Types.ObjectId;  // Expéditeur
  channelId?: Schema.Types.ObjectId;  // Si le message est dans un canal
  receiverId?: Schema.Types.ObjectId;  // Si le message est privé
  content: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file';  // Type de message
  isRead: boolean;  // Statut du message (lu ou non)
}

const messageSchema = new Schema<Message>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel' },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isRead: { type: Boolean, default: false }
});

export default mongoose.model<Message>('Message', messageSchema);
