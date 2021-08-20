const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const slotsSchema = new Schema({
  did: { type: Schema.Types.ObjectId, ref: "Doctor" },
  free: { type: Boolean, default: true },
  time: Date,
  pid: { type: Schema.Types.ObjectId, ref: "Patient" },
});

module.exports.TimeSlot = mongoose.model("TimeSlot", slotsSchema);
