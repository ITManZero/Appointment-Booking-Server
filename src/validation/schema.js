const {
  BCRYPT_MAX_BYTES,
  EMAIL_VERIFICATION_TOKEN_BYTES,
  EMAIL_VERIFICATION_SIGNATURE_BYTES,
  PASSWORD_RESET_BYTES,
} = require("../config");

const Joi = require("joi");

const id = Joi.required();

const email = Joi.string()
  .email()
  .min(8)
  .max(254)
  .lowercase()
  .trim()
  .required();

const name = Joi.string().min(3).max(128).trim().required();

const password = Joi.string()
  .min(8)
  .max(72, "utf8")
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
  .message(
    '"{#label}" must contain one uppercase letter, one lowercase letter, and one digit'
  )
  .required();

const password_confirmation = Joi.valid(Joi.ref("password")).required();

function token(length) {
  return Joi.string().length(length).required();
}

exports.registerSchema = Joi.object({
  email,
  full_name: name,
  password,
  password_confirmation,
});

exports.loginSchema = Joi.object({
  email,
  password,
});

exports.updateEmailSchema = Joi.object({ email });

exports.updateNameSchema = Joi.object({ name });

exports.updatePasswordSchema = Joi.object({
  current_passwrod: password,
  password,
  password_confirmation,
});

exports.verifyEmailSchema = Joi.object({
  id,
  token: token(EMAIL_VERIFICATION_TOKEN_BYTES),
  expires: Joi.date().timestamp().required(),
  signature: Joi.string().length(EMAIL_VERIFICATION_SIGNATURE_BYTES).required(),
});

exports.emailSchema = Joi.object({
  email,
});

// exports.resetPasswordSchema = Joi.object({
//   query: Joi.object({
//     id,
//     token: token(PASSWORD_RESET_BYTES * 2),
//   }),
//   body: Joi.object({
//     password,
//     password_confirmation,
//   }),
// });
