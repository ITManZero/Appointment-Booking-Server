const bcrypt = require("bcrypt");
const { logOut } = require("../../auth");
const { User } = require("../models");

const {
  validator,
  updatePasswordSchema,
  updateNameSchema,
  updateEmailSchema,
} = require("../validation");

const updatePassword = async (
  user,
  { current_passwrod, password, password_confirmation }
) => {
  validator(updatePasswordSchema, {
    password,
    password_confirmation,
    current_passwrod,
  });
  if (await user.matchPassword(current_passwrod, user.password)) {
    user.password = await bcrypt.hash(password, 10);
  } else throw new Error("incorrect password");
};

const updateName = async (user, { full_name }) => {
  validator(updateNameSchema, { full_name });

  if (!(await User.findById(req.session.userId))) {
    user.full_name = full_name;
  } else throw new Error("unavaliable name");
};

const updateEmail = async (user, { email }) => {
  validator(updateEmailSchema, { email });
  user.email = email;
};

exports.updateAccount = async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate("accountId")
    .exec();

  switch (req.query.section) {
    case "password":
      await updatePassword(user, req.body);
      break;
    case "name":
      await updateName(user, req.body);
      break;
    case "email":
      await updateEmail(user, req.body);
      break;
  }
  await user.save();
  await logOut(req, res);
  res.json({ user: user, status: "updated successfully" });
};
