const { User } = require("../models");
const { hashDate } = require("../../utils");

exports.getProfileInfo = async (req, res, next) => {
  const user = await User.findById(req.session.userId)
    .populate("accountData")
    .exec();

  if (!user) next();
  else res.json({ info: user });
};

exports.getAppointments = async (req, res, next) => {
  if (req.session.accountType == "Patient") {
    let patient = await User.findById(req.session.userId)
      .populate({
        path: "accountData",
        populate: {
          path: "appointments.times",
          model: "TimeSlot",
          select: "time did",
          populate: {
            path: "did",
            model: "User",
            select: "fullName",
          },
        },
      })
      .exec();
    if (!patient) next();
    else {
      if (!req.query.onDate) res.json({ myAppointments: patient });
      else {
        // let index = patient.accountData.appointments.length - 1;
        let appointmentInDay;
        for (let i = 0; i < patient.accountData.appointments.length; i++)
          if (
            patient.accountData.appointments[i].daykey ==
            hashDate(new Date(parseInt(req.query.onDate.trim())))
          ) {
            appointmentInDay = patient.accountData.appointments[i];
            index = i;
          }
        res.json({ appointmentInDay });
      }
    }
  } else {
    let doctor;
    if (req.query.onDate) {
      doctor = await User.findById(req.session.userId)
        .populate({
          path: "accountData",
          select: "days",
          populate: {
            path: "days",
            model: "Day",
            select: "timeSlots",
            match: {
              daykey: hashDate(new Date(parseInt(req.query.onDate.trim()))),
            },
            populate: {
              path: "timeSlots",
              model: "TimeSlot",
              // match: { free: false },
              select: "time pid",
              populate: {
                path: "pid",
                model: "User",
                select: "fullName",
              },
            },
          },
        })
        .exec();
    } else {
      doctor = await User.findById(req.session.userId)
        .populate({
          path: "accountData",
          select: "days",
          populate: {
            path: "days",
            model: "Day",
            select: "timeSlots",
            populate: {
              path: "timeSlots",
              model: "TimeSlot",
              // match: { free: false },
              select: "time pid",
              populate: {
                path: "pid",
                model: "User",
                select: "fullName",
              },
            },
          },
        })
        .exec();
    }
    if (!doctor) next();
    else res.json({ docAppointments: doctor });
  }
};
