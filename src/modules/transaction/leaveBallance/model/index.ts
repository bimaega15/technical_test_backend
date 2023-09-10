import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    typeLeaveRef: {
      type: Types.ObjectId,
      ref: "TypeLeave",
    },
    employeeRef: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    earlyPeriod: Date,
    endPeriod: Date,
    ballance: Number,
    isActive: Boolean,
    usersCreate: {
      type: Types.ObjectId,
      ref: "Users",
    },
    usersUpdate: {
      type: Types.ObjectId,
      ref: "Users",
    },
  },
  {
    collection: "leaveBallance",
    timestamps: true,
  }
);

const LeaveBallance = mongoose.model("LeaveBallance", schema);
export default LeaveBallance;
