const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected '))
  .catch(err => console.error('Mongo Error ', err));

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('', 10); // change this password
  const admin = new Admin({
    name: "Karan Singh",
    email: "singhkaran91973@gmail.com",
    password: hashedPassword,
    year: "4th",
    branch: "CSE"
  });

  await admin.save();
  console.log(' Admin created successfully!');
  mongoose.disconnect();
}

createAdmin();


//node createAdmin.js
// This script creates an admin user in the MongoDB database.