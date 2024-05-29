import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(6)
    .pattern(new RegExp(/\d/))
    .message(
      "Password must contain at least 6 characters and at least one number"
    ),
  avatarUrl: Joi.string()
    .optional()
    .allow("")
    .default(
      "https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.avif"
    ),
});

export default userSchema;
