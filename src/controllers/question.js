import { v4 as uuidv4 } from "uuid";
import QuestionModel from "../models/question.js";

const CREATE_QUESTION = async (req, res) => {
  try {
    const question = new QuestionModel({
      id: uuidv4(),
      date: Date.now(),
      question_title: req.body.question_title,
      question_text: req.body.question_text,
      user_id: req.body.id,
    });

    const response = await question.save();

    return res
      .status(201)
      .json({ status: "Question was created", response: response });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const GET_ALL_QUESTIONS = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const questions = await QuestionModel.aggregate([
      {
        $lookup: {
          from: "answers",
          localField: "id",
          foreignField: "question_id",
          as: "answers",
        },
      },
      {
        $addFields: {
          answer_count: { $size: "$answers" },
        },
      },
      {
        $project: {
          answers: 0,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalQuestions = await QuestionModel.countDocuments();
    const totalPages = Math.ceil(totalQuestions / limit);

    return res.json({
      totalQuestions: totalQuestions,
      totalPages: totalPages,
      currentPage: page,
      questions: questions,
    });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const GET_QUESTION_BY_ID = async (req, res) => {
  try {
    const question = await QuestionModel.findOne({
      id: req.params.id,
    });

    if (!question) {
      return res.status(404).json({
        message: `Question with id: ${req.params.id} was not found`,
      });
    }

    return res.json({ question: question });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const DELETE_QUESTION_BY_ID = async (req, res) => {
  try {
    const deletedQuestion = await QuestionModel.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedQuestion) {
      return res.status(404).json({
        message: `Question with id: ${req.params.id} was not found`,
      });
    }

    return res
      .status(200)
      .json({ message: `Question with id: ${req.params.id} was deleted` });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

export {
  CREATE_QUESTION,
  GET_ALL_QUESTIONS,
  GET_QUESTION_BY_ID,
  DELETE_QUESTION_BY_ID,
};
