import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    name: String,
    quantity: Number,
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
    collection: "typeLeave",
    timestamps: true,
  }
);

const TypeLeave = mongoose.model("TypeLeave", schema);
export default TypeLeave;
