const router = require("express").Router();

const { getProfileInfo, updateAccount } = require("../controllers");
const { authnecated } = require("../middlewares");

router.route("/").get(authnecated, getProfileInfo);

router.route("/account/").post(authnecated, updateAccount);

module.exports.settings = router;
