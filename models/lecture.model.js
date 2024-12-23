const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    videoTitle: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    videoDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["live", "recorded"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    lectureDate: {
      type: Date,
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    notesCount: {
      type: Number,
      required: true,
      default: 0,
    },
    quizCount: {
      type: Number,
      required: true,
      default: 0,
    },
    lecturerName: {
      type: String,
      required: true,
    },
    streamKey: {
      type: String,
      required: false,
    } 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lecture", lectureSchema);
