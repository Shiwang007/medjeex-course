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
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  otherComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
