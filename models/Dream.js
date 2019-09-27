const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const dreamSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
  image: String,
  text: String
});

const Dream = mongoose.model("Dream", dreamSchema);

module.exports = Dream;