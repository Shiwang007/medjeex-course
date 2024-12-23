const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      enum: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Botany",
        "Science",
        "Zoology",
      ],
    },
    chapterName: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);
