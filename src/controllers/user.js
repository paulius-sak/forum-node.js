import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const SIGN_IN = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new UserModel({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
      avatarUrl: req.body.avatarUrl,
      date: Date.now(),
    });

    const response = await user.save();

    return res
      .status(200)
      .json({ status: "User sign-in successful", response: response });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const LOG_IN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email or password is incorrect" });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ message: "Email or password is incorrect" });
    }

    const jwt_token = jwt.sign(
      { userEmail: user.email, user_id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const jwt_refresh_token = jwt.sign(
      { userEmail: user.email, user_id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "User log-in successful",
      jwt: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const REFRESH_TOKEN = async (req, res) => {
  try {
    const { jwt_refresh_token } = req.body;

    if (!jwt_refresh_token) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    jwt.verify(
      jwt_refresh_token,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(400).json({
            message: "Invalid refresh token, log-in again to continue.",
          });
        }

        const jwt_token = jwt.sign(
          { userEmail: decoded.userEmail, user_id: decoded.user_id },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        const jwt_refresh_token = jwt.sign(
          { userEmail: decoded.userEmail, user_id: decoded.user_id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "24h" }
        );

        return res.status(200).json({
          message: "User JWT refreshed successfully",
          jwt: jwt_token,
          jwt_refresh_token: jwt_refresh_token,
        });
      }
    );
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "Error occurred" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find()

    return res.json({ users: users });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const GET_USERS_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({
        message: `User with id: ${req.params.id} was not found`,
      });
    }

    return res.json({ user: user });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const GET_CURRENT_USER = async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({
        message: `User not found`,
      });
    }

    return res.json({ user: user });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const UPDATE_USER = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // if (updates.password) {
    //   const salt = bcrypt.genSaltSync(10);
    //   updates.password = bcrypt.hashSync(updates.password, salt);
    // }

    const user = await UserModel.findOneAndUpdate({ id: userId }, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        message: `User with id: ${userId} was not found`,
      });
    }

    return res.status(200).json({
      message: `User with id: ${userId} has been updated successfully`,
      user: user,
    });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};

const DELETE_USER = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findOneAndDelete({ id: userId });

    if (!user) {
      return res.status(404).json({
        message: `User with id: ${userId} was not found`,
      });
    }

    return res.status(200).json({
      message: `User with id: ${userId} has been deleted successfully`,
    });
  } catch (err) {
    console.log("handled error: ", err);
    return res.status(500).json({ message: "error happened" });
  }
};


export {
  SIGN_IN,
  LOG_IN,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USERS_BY_ID,
  GET_CURRENT_USER,
  UPDATE_USER,
  DELETE_USER
};
