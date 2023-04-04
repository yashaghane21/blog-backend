const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],

  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const usermodel = mongoose.model('User', userschema);
module.exports = usermodel;