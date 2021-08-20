const { Patient } = require("../models");

const type = "Patient";

module.exports.patientCtrl = {
  createAccount,
  type,
  update,
};

async function createAccount(fields) {
  const patienDoc = await new Patient(fields);
  await patienDoc.save();
  return patienDoc._id;
}

async function update(req, res) {
  const patienDoc = await Patient.findOneAndUpdate(
    req.parm.accid,
    req.body.fields
  );
  patienDoc.save();
}
