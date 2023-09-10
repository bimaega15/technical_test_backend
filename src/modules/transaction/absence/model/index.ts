import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    typeLeaveRef: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    scheduleRef: {
      type: Types.ObjectId,
      ref: "Schedule",
    },
    dateSchedule: Date,
    isWork: Boolean,
    isPresent: Boolean,
    entryOfDate: Date,
    outOfDate: Date,
    isTooLate: Boolean,
    isEarlyHome: Boolean,
    isLeave: Boolean,
    isOvertime: Boolean,
    totalHoursWorked: Number,
    totalHoursReal: Number,
    totalHoursLate: Number,
    totalHoursEaryly: Number,
    totalHoursOvertime: Number,
    reasonLate: String,
    reasonEarly: String,
    typeAbsenceRef: {
      type: Types.ObjectId,
      ref: "TypeAbsence",
    },
    isChangeSchedule: Boolean,
    replacementEmployee: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    isHomeCare: Boolean,
    isAgree: Boolean,
    superiorsStatement: String,
    employeeStatement: String,
  },
  {
    collection: "absence",
    timestamps: true,
  }
);

const Absence = mongoose.model("Absence", schema);
export default Absence;
