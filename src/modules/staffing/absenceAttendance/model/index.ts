import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    typeAbsenceRef: {
      type: Types.ObjectId,
      ref: "TypeAbsence",
    },
    employeeRef: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    requestDate: Date,
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
    collection: "requestAttendance",
    timestamps: true,
  }
);

const RequestAttendance = mongoose.model("RequestAttendance", schema);
export default RequestAttendance;
