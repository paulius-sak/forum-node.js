import { v4 as uuidv4 } from "uuid";
import AnswerModel from "../models/answer.js";

const CREATE_ANSWER = async (req, res) => {
  try {
    const { question_id } = req.params
    const answer = new AnswerModel({
      id: uuidv4(),
      date: Date.now(),
      answer_text: req.body.answer_text,
      question_id: question_id,
      gained_likes: [],
      gained_dislikes: [],
      user_id: req.body.id,
    });

    const response = await answer.save();

    return res
      .status(200)
      .json({ status: "Answer posted successfully", response: response });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const GET_ALL_ANSWERS = async (req, res) => {
  try {
    const answers = await AnswerModel.find({ question_id: req.params.id });

    if (!answers.length) {
      return res.status(404).json({
        message: `Question with id: ${req.params.id} have no answers`,
      });
    }

    return res.json({ answers: answers });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const DELETE_ANSWER_BY_ID = async (req, res) => {
  try {
    const deletedAnswer = await AnswerModel.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedAnswer) {
      return res.status(404).json({
        message: `Answer with id: ${req.params.id} was not found`,
      });
    }

    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const LIKE_ANSWER = async (req, res) => {
  try {
    const userId = req.body.id;

    const answer = await AnswerModel.findOne({ id: req.params.id });

    if (!answer) {
      return res
        .status(404)
        .json({ message: `Answer with id: ${req.params.id} was not found` });
    }

    if (answer.gained_likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already liked this answer" });
    }

    if (answer.gained_dislikes.includes(userId)) {
      answer.gained_dislikes.pull(userId);
    }

    answer.gained_likes.push(userId);

    await answer.save();

    return res.status(200).json({ message: "Answer liked", answer: answer });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const DISLIKE_ANSWER = async (req, res) => {
  try {
    const userId = req.body.id; 

    const answer = await AnswerModel.findOne({ id: req.params.id });

    if (!answer) {
      return res
        .status(404)
        .json({ message: `Answer with id: ${req.params.id} was not found` });
    }

    if (answer.gained_dislikes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already disliked this answer" });
    }

    if (answer.gained_likes.includes(userId)) {
      answer.gained_likes.pull(userId);
    }

    answer.gained_dislikes.push(userId);

    await answer.save();

    return res.status(200).json({ message: "Answer disliked", answer: answer });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

export { CREATE_ANSWER, DELETE_ANSWER_BY_ID, GET_ALL_ANSWERS, LIKE_ANSWER, DISLIKE_ANSWER };
