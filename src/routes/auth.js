const router = require("express").Router();

const { authCtrl, doctorCtrl, patientCtrl } = require("../controllers");

const { guest, authnecated } = require("../middlewares");

router.route("/login").post(guest, authCtrl.login);

router.route("/dr/signup").post(guest, authCtrl.signup(doctorCtrl));

router.route("/pt/signup").post(guest, authCtrl.signup(patientCtrl));

router.route("/logout").get(authnecated, authCtrl.logout);

module.exports.auth = router;
