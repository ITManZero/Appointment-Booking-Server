const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const { createHash, createHmac, timingSafeEqual } = require("crypto");

const {
  APP_SECRET,
  EMAIL_VERIFICATION_TIMEOUT,
  APP_ORIGIN,
} = require("../config");

const userSchema = new Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "email already exist"],
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  verifiedAt: {
    type: Date,
  },

  accountData: {
    type: Schema.Types.ObjectId,
    refPath: "accountType",
  },

  accountType: {
    type: String,
    required: true,
    enum: ["Doctor", "Patient"],
  },
});

userSchema.methods.matchPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.verificationUrl = function () {
  const token = createHash("sha1").update(this.email).digest("hex");
  const expires = Date.now() + EMAIL_VERIFICATION_TIMEOUT;
  const url = `${APP_ORIGIN}/email/verify?id=${this.id}&token=${token}&expires=${expires}`;
  const signature = User.signVerificationUrl(url);
  return `${url}&signature=${signature}`;
};

userSchema.statics.signVerificationUrl = (url) =>
  createHmac("sha256", APP_SECRET).update(url).digest("hex");

userSchema.statics.hasValidVerificationUrl = (path, query) => {
  const url = `${APP_ORIGIN}${path}`;
  const original = url.slice(0, url.lastIndexOf("&"));
  const signature = User.signVerificationUrl(original);
  return (
    timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature)) &&
    +query.expires > Date.now()
  );
};

const User = mongoose.model("User", userSchema, "Users");
module.exports.User = User;
