const { SESSION_NAME } = require("./src/config");

exports.logIn = (req, userId, accountType) => {
  req.session.userId = userId;
  req.session.accountType = accountType;
  req.session.createdAt = Date.now();
  //console.log(req.session);
};

exports.isLoggedIn = (req) => req.session.userId;

exports.logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);

      res.clearCookie(SESSION_NAME);

      resolve();
    });
  });

exports.isPatient = (req) => req.session.accountType == "Patient";

exports.markAsVerified = async (user) => {
  user.verifiedAt = new Date();
  await user.save();
};
