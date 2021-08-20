const { isLoggedIn, isPatient } = require("../../auth");
const { User } = require("../models");

exports.guest = (req, res, next) => {
  if (isLoggedIn(req)) {
    // if (req.method === "POST")
    // throw new Error("you are already logged in");
    return res.json({ error: "you are already logged in!" });
    // res.redirect("/");
  } else next();
};

exports.verified = async (req, res, next) => {
  const { id } = req.query;

  const { email } = req.body;

  let user;
  if (id) user = await User.findById(id).select("verifiedAt");
  else user = await User.findOne({ email }).select("verifiedAt");

  if (user && user.verifiedAt)
    throw next(new Error("Account already verified"));
  next();
};

exports.authnecated = (req, res, next) => {
  if (!isLoggedIn(req)) {
    // if (req.method === "POST")
    // throw new Error("you must be logged in");
    return res.json({ error: "you must be logged in" });
    // res.redirect(`/account/login?next=${req.originalUrl}`);
  } else next();
};

exports.patient = (req, res, next) => {
  if (!isPatient(req)) {
    // if (req.method === "POST")
    throw new Error("you must be patient ");
    // res.redirect(`/account/login?next=${req.originalUrl}`);
  } else next();
};
