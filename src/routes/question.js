import express from "express";
import {
  CREATE_QUESTION,
  GET_ALL_QUESTIONS,
  GET_QUESTION_BY_ID,
  DELETE_QUESTION_BY_ID,
  GET_ALL_USER_QUESTIONS,
} from "../controllers/question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/questions", auth, CREATE_QUESTION);
router.get("/questions", GET_ALL_QUESTIONS);
router.get("/questions/:id", GET_QUESTION_BY_ID);
router.get("/user/questions", auth, GET_ALL_USER_QUESTIONS);
router.delete("/questions/:id", auth, DELETE_QUESTION_BY_ID);
1
export default router;
