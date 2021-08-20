const router = require("express").Router();

const { getProfileInfo, getAppointments } = require("../controllers");
const { authnecated } = require("../middlewares");

router.route("/").get(authnecated, getProfileInfo);

router.route("/myappointments").get(authnecated, getAppointments);

module.exports.profile = router;
