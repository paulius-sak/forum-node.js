import express from "express";
import {
  SIGN_IN,
  LOG_IN,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USERS_BY_ID,
  GET_CURRENT_USER,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
import validation from "../middleware/validation.js";
import userSchema from "../validationSchema/user.js";

const router = express.Router();

router.post("/users", validation(userSchema), SIGN_IN);
router.post("/users/login", LOG_IN);

router.get("/users/refresh", REFRESH_TOKEN);

router.get("/users/:id", auth, GET_USERS_BY_ID);

router.get("/users", GET_ALL_USERS);

router.get("/user/me", auth, GET_CURRENT_USER);

export default router;
