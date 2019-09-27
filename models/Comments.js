const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentsSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  Dream: {type: Schema.Types.ObjectId, ref: 'Dream'},
  text: String
});

const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;