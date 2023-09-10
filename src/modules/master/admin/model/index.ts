import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: String,
    address: String,
    phoneNumber: String,
    email: String,
    gender: {
      type: String,
      enum: ["L", "P"],
    },
    picture: String,
    isActive: {
      type: Boolean,
    },
    usersMappingRef: {
      type: String,
      default: null,
    },
  },
  {
    collection: "admin",
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", schema);
export default Admin;
