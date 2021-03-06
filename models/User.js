const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  image: String,
  email: String,
  realName: String,
  googleID: String,
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  following: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dreams: [{type: Schema.Types.ObjectId, ref: 'Dream'}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;