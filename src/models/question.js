import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  question_title: { type: String, required: true },
  question_text: { type: String },
  user_id: { type: String, required: true },
});

export default mongoose.model("Question", questionSchema);
