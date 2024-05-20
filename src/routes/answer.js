import express from "express";
import {CREATE_ANSWER, DELETE_ANSWER_BY_ID, GET_ALL_ANSWERS} from "../controllers/answer.js"
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/questions/:id/answers", auth, CREATE_ANSWER)

router.get("/questions/:id/answers", auth, GET_ALL_ANSWERS)

router.delete("/answers/:id", auth, DELETE_ANSWER_BY_ID)

export default router;