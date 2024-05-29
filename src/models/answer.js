import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  answer_text: { type: String, required: true },
  question_id: { type: String },
  gained_likes: { type: Array, default: [] },
  gained_dislikes: { type: Array, default: [] },
  user_id: { type: String },
});

export default mongoose.model("Answer", answerSchema);
