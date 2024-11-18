// seeder.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./user.model');

// Fonction pour hacher les mots de passe et insérer des utilisateurs
const seedUsers = async () => {
  // Connexion à la base de données
  await connectDB();

  // Liste d'utilisateurs à insérer
  const users = [
    {
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'password123',
      status: 'online',
      isOnline: true,
    },
    {
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      password: 'securepassword456',
      status: 'offline',
      isOnline: false,
    },
    {
      username: 'alice_johnson',
      email: 'alice.johnson@example.com',
      password: 'alicepassword789',
      status: 'hidden',
      isOnline: false,
    },
  ];

  // Parcourir chaque utilisateur et les insérer dans la base de données
  for (let user of users) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        ...user,
        password: hashedPassword,
      });
      await newUser.save();
      console.log(`User ${user.username} created.`);
    } else {
      console.log(`User ${user.username} already exists.`);
    }
  }

  mongoose.connection.close();
};

// Exécuter le seeder
seedUsers().then(() => console.log('Seeding completed.'));
