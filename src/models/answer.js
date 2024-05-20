import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  answer_text: { type: String, required: true },
  question_id: { type: String, required: true },
  gained_likes: { type: Array },
  gained_dislikes: { type: Array },
});

export default mongoose.model("Answer", answerSchema);
