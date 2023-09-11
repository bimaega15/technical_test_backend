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
    startDateLeave: Date,
    endDateLeave: Date,
    employeeChangeRef: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    information: String,
    superiorRef: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    isAgree: Boolean,
    requestTime: Date,
    agreeTime: Date,
    picture: String,
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
    collection: "requestLeave",
    timestamps: true,
  }
);

const RequestLeave = mongoose.model("RequestLeave", schema);
export default RequestLeave;
