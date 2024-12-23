const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    notesTitle: {
      type: String,
      required: true,
    },
    notesDescription: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    LectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notes", notesSchema);
