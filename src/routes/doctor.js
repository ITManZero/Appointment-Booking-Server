const router = require("express").Router();

const {
  getDoctorInfo,
  getTimeSlots,
  appointmentCtrl,
} = require("../controllers");
const { patient } = require("../middlewares");

router.route("/:doctorid").get(patient, getDoctorInfo);

router.route("/:doctorid/:date").get(patient, getTimeSlots); //create them if did not exist

router.route("/:doctorid").post(patient, appointmentCtrl);

module.exports.doctor = router;
