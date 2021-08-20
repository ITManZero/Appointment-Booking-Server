const { User, Doctor, Patient, Day, TimeSlot } = require("../models");

const { hashDate, getExpireDate, parseValidDate } = require("../../utils");

const type = "Doctor";

module.exports.doctorCtrl = {
  createAccount,
  type,
  update,
};

async function createAccount(fields) {
  const doctorDoc = await new Doctor(fields);
  await doctorDoc.save();
  return doctorDoc._id;
}

async function update(req, res) {
  const doctorDoc = await Patient.findOneAndUpdate(
    req.parm.accid,
    req.body.fields
  );
  doctorDoc.save();
}

module.exports.getDoctorInfo = async (req, res, next) => {
  const doctor = await User.findById(req.params.doctorid)
    .populate({
      path: "accountData",
      populate: {
        path: "days",
        model: "Day",
        select: "daykey timeSlots",
        populate: {
          path: "timeSlots",
          model: "TimeSlot",
          select: "time free",
        },
      },
    })
    .exec();

  if (!doctor) next();
  res.json({
    doctor,
  });
};

module.exports.getTimeSlots = async (req, res, next) => {
  const date = new Date(parseInt(req.params.date.trim()));

  const hashedDate = hashDate(date);
  const expireDate = getExpireDate(date);

  const doctor = await User.findById(req.params.doctorid)
    .populate({
      path: "accountData",
      populate: {
        path: "days",
        model: "Day",
        match: { daykey: hashedDate },
      },
    })
    .exec();

  let day;
  if (doctor.accountData.days.length == 0) {
    let plan = doctor.accountData.standardPlan;
    let slots = parseValidDate(
      plan[0].from,
      plan[0].to,
      plan[0].constraint,
      30,
      date
    );

    day = await new Day({
      daykey: hashedDate,
      expireAt: expireDate,
    });

    for (let i = 0; i < slots.length; i++) {
      day.timeSlots.push(new TimeSlot({ did: doctor._id, time: slots[i] }));
      await day.timeSlots[i].save();
    }
    await day.save();
    doctor.accountData.days.push(day._id);
    await doctor.accountData.save();
  } else day = doctor.accountData.days[0];
  day = await day.populate("timeSlots").execPopulate();
  res.json({ key: day.daykey, SlotsIds: day.timeSlots });
};
