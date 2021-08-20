const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paSchema = new Schema({
  appointments: [
    {
      daykey: Number,
      times: [
        {
          type: Schema.Types.ObjectId,
          ref: "TimeSlot",
        },
      ],
    },
  ],
});

module.exports.Patient = mongoose.model("Patient", paSchema, "Patients");
