const { User } = require("../models");

const { hashDate } = require("../../utils");

module.exports.appointmentCtrl = async (req, res, next) => {
  if (req.query.BookingDate) {
    bookingAppointment(
      req.query.BookingDate,
      req.params.doctorid,
      req.session.userId,
      res
    );
  } else if (req.query.CancelBookingDate) {
    cancelAppointment(req.query.CancelBookingDate, req.params.doctorid, res);
  } else next();
};

bookingAppointment = async (bookingDate, doctorid, userId, res) => {
  const date = new Date(parseInt(bookingDate.trim()));
  const hashedDate = hashDate(date);

  // don't enter invalid date (not match anyslots in db)
  // note: to create slots you have to request myAppointments route in specific date it
  // automaticlly create them
  /* tested date */
  //1629273600158
  //1629192600307

  const doctor = await User.findById(doctorid)
    .populate({
      path: "accountData",
      populate: {
        path: "days",
        model: "Day",
        match: { daykey: hashedDate },
        populate: {
          path: "timeSlots",
          model: "TimeSlot",
          match: { time: date },
        },
      },
    })
    .exec();

  if (doctor.accountData.days.length == 0)
    return res.json({ message: "something went wrong" });

  let slot = doctor.accountData.days[0].timeSlots[0];

  slot.free = false;
  slot.pid = userId;
  await slot.save();

  let patient = await User.findById(slot.pid)
    .populate({
      path: "accountData",
      populate: {
        path: "appointments.times",
        model: "TimeSlot",
      },
    })
    .exec();

  let index = patient.accountData.appointments.length - 1;
  let appointmentInDay;
  for (let i = 0; i < patient.accountData.appointments.length; i++)
    if (patient.accountData.appointments[i].daykey == hashedDate) {
      appointmentInDay = patient.accountData.appointments[i];
      index = i;
    }

  if (!appointmentInDay) {
    patient.accountData.appointments.push({
      daykey: hashedDate,
    });
    index++;
    appointmentInDay = patient.accountData.appointments[index];
  }

  let found = false;
  let patientTimes = patient.accountData.appointments[index].times;
  for (let i = 0; i < patientTimes.length && !found; i++) {
    if (patientTimes[i]._id.equals(slot._id)) found = true;
  }

  if (found) return res.json({ message: "already booked" });
  else patient.accountData.appointments[index].times.push(slot._id);

  await patient.accountData.save();

  await doctor.accountData.days[0].save();

  res.json({ selectedTimeslot: slot, appointmentInDay });
};

cancelAppointment = async (CancelBookingDate, doctorid, res) => {
  const date = new Date(parseInt(CancelBookingDate.trim()));
  const hashedDate = hashDate(date);

  const doctor = await User.findById(doctorid)
    .populate({
      path: "accountData",
      populate: {
        path: "days",
        model: "Day",
        match: { daykey: hashedDate },
        populate: {
          path: "timeSlots",
          model: "TimeSlot",
          match: { time: date },
        },
      },
    })
    .exec();

  if (doctor.accountData.days.length == 0)
    return res.json({ message: "something went wrong" });

  let slot = doctor.accountData.days[0].timeSlots[0];

  let patient = await User.findById(slot.pid)
    .populate({
      path: "accountData",
      populate: {
        path: "appointments.times",
        model: "TimeSlot",
      },
    })
    .exec();

  let index = patient.accountData.appointments.length - 1;
  let appointmentInDay;
  for (let i = 0; i < patient.accountData.appointments.length; i++)
    if (patient.accountData.appointments[i].daykey == hashedDate) {
      appointmentInDay = patient.accountData.appointments[i];
      index = i;
    }
  console.log(appointmentInDay);

  if (!appointmentInDay) {
    return res.json({ message: "something went wrong" });
  }

  let patientTimes = patient.accountData.appointments[index].times;
  for (let i = 0; i < patientTimes.length; i++) {
    if (patientTimes[i]._id.equals(slot._id)) {
      patientTimes.splice(i, 1);
      break;
    }
  }

  if (patient.accountData.appointments[index].times.length == 0)
    patient.accountData.appointments.splice(index, 1);

  slot.free = true;
  slot.pid = undefined;

  await slot.save();

  await patient.accountData.save();

  res.json({ message: "Successfully Canceled" });
};
