import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    timeEntry: Number,
    timeOut: Number,
    isActive: Boolean,
    color: String,
    typeSchedule: {
      type: String,
      enum: ["pagi", "siang", "malam", "office"],
    },
    delayTolerance: Number,
    attendanceTimeTolerance: Number,
  },
  {
    collection: "schedule",
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", schema);
export default Schedule;
