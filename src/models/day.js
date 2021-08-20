const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daySchema = new Schema(
  {
    daykey: Number,
    timeSlots: [{ type: Schema.Types.ObjectId, ref: "TimeSlot" }],
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

//daySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports.Day = mongoose.model("Day", daySchema);
