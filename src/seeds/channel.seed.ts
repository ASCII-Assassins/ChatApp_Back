import { connect } from 'mongoose';
import mongoose from 'mongoose';

import { Channel, ChannelSchema } from '../schemas/channel.schema'; // Import ChannelModel
import * as dotenv from 'dotenv';

dotenv.config();

async function seedChannels() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-service';

  // Connect to the database
  await mongoose.connect(mongoUri);
  const connection = mongoose.connection;

  const channelModel = connection.model('User', ChannelSchema);

    // Define seed data
    const channels = [
      { name: 'General', members: ['user1', 'user2'], createdAt: new Date() },
      { name: 'Development', members: ['user3', 'user4'], createdAt: new Date() },
      { name: 'Marketing', members: ['user5'], createdAt: new Date() },
    ];

    // Insert the seed data
    try {
        // Insert seed data
        await channelModel.insertMany(channels);
    console.log('Channel seed data inserted successfully');
    // await mongooseInstance.disconnect(); // Close the connection
  }catch (error) {
    console.error('Error seeding user data:', error);
  } finally {
    // Close the database connection
    await connection.close();
  }
}

// Run the seeder
seedChannels();
