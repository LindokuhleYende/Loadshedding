//This defines the structure of your user data — how the data is saved in the database.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User Schema Definition
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
//Mongoose middleware — it runs before saving a user to the database.
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema); // Export the User model