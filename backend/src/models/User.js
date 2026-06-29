const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String, // hashed password
    },

    googleId: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "local", // prevents validation error
    },

    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);