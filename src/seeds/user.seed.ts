import mongoose from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedUsers() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-service';

  // Connect to the database
  await mongoose.connect(mongoUri);
  const connection = mongoose.connection;

  const userModel = connection.model('User', UserSchema);

  // Define seed data
  const users = [
    { username: 'Yasin', email: 'alice@example.com', status: 'online', isOnline: true },
    { username: 'Ahmado', email: 'bob@example.com', status: 'offline', isOnline: false },
    { username: 'Charlie', email: 'charlie@example.com', status: 'hidden', isOnline: false },
  ];

  try {
    // Insert seed data
    await userModel.insertMany(users);
    console.log('User data seeded successfully!');
  } catch (error) {
    console.error('Error seeding user data:', error);
  } finally {
    // Close the database connection
    await connection.close();
  }
}

seedUsers();
