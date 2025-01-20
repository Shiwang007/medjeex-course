const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
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
      },
    ],
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", 
      default: null, 
    },
  },
  { timestamps: true }
);

commentSchema.index({ lectureId: 1 });
commentSchema.index({ parentCommentId: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
