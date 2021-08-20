const { User } = require("../models");

const { logIn, logOut } = require("../../auth");

const bcrypt = require("bcrypt");

const { registerSchema, loginSchema, validator } = require("../validation");
const { json } = require("express");

module.exports.authCtrl = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const validationResult = await validator(loginSchema, { email, password });
    if (!validationResult.success)
      return res.json({ error: validationResult.error });

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password, user.password)))
      return res.json("incorrect email or password");
    // throw new Error("incorrect email or password");

    logIn(req, user._id, user.accountType);

    res.json({
      user,
    });
  },
  signup: ({ createAccount, type }) => {
    return async (req, res) => {
      const { email, password, password_confirmation, full_name, fields } =
        req.body;

      const validationResult = await validator(registerSchema, {
        email,
        password,
        password_confirmation,
        full_name,
      });

      if (!validationResult.success)
        return res.json({ error: validationResult.error });

      let user = await User.findOne({ email });

      if (user) return res.json("already exist email");
      // throw new Error("already exist email");

      const hashed = await bcrypt.hash(password, 10);

      user = await new User({
        email,
        password: hashed,
        accountType: type,
        fullName: full_name,
        accountData: await createAccount(fields),
      });
      await user.save();

      logIn(req, user._id, user.accountType);

      const link = user.verificationUrl();

      //console.log(link);

      res.json({
        user: user,
        userType: user.userType,
      });
    };
  },
  logout: async (req, res) => {
    await logOut(req, res);
    res.json({ status: "logged out" });
  },
};
