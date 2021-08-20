const router = require("express").Router();
const { emailVerification, resendVerificationLink } = require("../controllers");

const { authnecated, verified } = require("../middlewares");

router.route("/verify").post(authnecated, verified, emailVerification);
router.route("/resend").post(authnecated, verified, resendVerificationLink);

module.exports.verification = router;
