const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
  },
  dislikes: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
  },
  otherComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
