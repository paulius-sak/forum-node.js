import express from "express";
import {CREATE_QUESTION, GET_ALL_QUESTIONS, GET_QUESTION_BY_ID, DELETE_QUESTION_BY_ID} from "../controllers/question.js"
import auth from "../middleware/auth.js"
import validation from "../middleware/validation.js"


const router = express.Router();

router.post("/questions", auth, CREATE_QUESTION);
router.get("/questions", auth, GET_ALL_QUESTIONS);
router.get("/questions/:id", auth, GET_QUESTION_BY_ID);
router.delete("/questions/:id", auth, DELETE_QUESTION_BY_ID);

export default router;