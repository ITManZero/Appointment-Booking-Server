const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rateSchema = new Schema({
  waitTime: Number,
  besideManner: Number,
  all: Number,
});

const hospitalSchema = new Schema({
  name: String,
  //TODO google hashed key
});

const standardTimeline = new Schema({
  from: String,
  to: String,
  constraint: [{ from: String, to: String }],
});

const drSchema = new Schema({
  specialties: [
    {
      type: String,
      required: true,
      enum: ["اطفال", "عظمية", "عام", "اسنان"],
    },
  ],
  location: {
    lng: { type: Number, default: 400000 },
    lat: { type: Number, default: 400000 },
  },
  days: [{ type: Schema.Types.ObjectId, ref: "Day" }],
  claimed: false,
  hospitals: [hospitalSchema],
  rate: rateSchema,

  standardPlan: {
    type: [
      {
        type: standardTimeline,
      },
    ],
    //validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
  },
  // address:
});

function arrayLimit(length) {
  return length < 8;
}
module.exports.Doctor = mongoose.model("Doctor", drSchema);
