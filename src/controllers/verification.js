const { User } = require("../models");
const { markAsVerified } = require("../../auth");
const { verifyEmailSchema, emailSchema, validator } = require("../validation");

exports.emailVerification = async (req, res, next) => {
  await validator(verifyEmailSchema, req.query);

  const { id } = req.query;

  const user = await User.findById(id).select("verifiedAt");

  const matchSignature = User.hasValidVerificationUrl(
    req.originalUrl,
    req.query
  );

  if (!user || !matchSignature) {
    throw next(new Error("Invalid activation link"));
  }

  await markAsVerified(user);

  res.status(200).json({ status: "sucess", message: "verified" });
};

exports.resendVerificationLink = async (req, res) => {
  await validator(emailSchema, req.body);

  const { email } = req.body;

  const user = await User.findOne({ email }).select("email verifiedAt");

  if (user && !user.verifiedAt) {
    const link = user.verificationUrl();

    //console.log(link);

    // await sendMail({
    //   to: email,
    //   subject: "Verify your email address",
    //   text: link,
    // });
  }

  res.json({
    message:
      "If your email address needs to be verified, you will receive an email with the activation link",
  });
};
