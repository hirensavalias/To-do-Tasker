const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    userId: String,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", DataSchema);