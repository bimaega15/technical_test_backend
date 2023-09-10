import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    name: String,
    typeIdentity: {
      type: String,
      enum: ["ktp", "sim", "passport"],
      default: null,
    },
    numberIdentity: String,
    fullName: String,
    gender: {
      type: String,
      enum: ["L", "P"],
    },
    placeOfBirth: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    marriedStatus: {
      type: Types.ObjectId,
      ref: "Statics",
    },
    religion: {
      type: Types.ObjectId,
      ref: "Statics",
    },
    education: {
      type: Types.ObjectId,
      ref: "Statics",
    },
    residenceAddress: {
      type: String,
    },
    ktpAddress: {
      type: String,
    },
    phoneNumber1: {
      type: String,
    },
    phoneNumber2: {
      type: String,
    },
    email: {
      type: String,
    },
    employeeNumber: {
      type: String,
    },
    dateOfEntry: {
      type: Date,
    },
    outDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
    },
    usersCreate: {
      type: Types.ObjectId,
      ref: "Users",
    },
    usersUpdate: {
      type: Types.ObjectId,
      ref: "Users",
    },
    picture: {
      type: String,
    },
    usersMappingRef: {
      type: String,
    }
  },
  {
    collection: "employee",
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", schema);
export default Employee;
