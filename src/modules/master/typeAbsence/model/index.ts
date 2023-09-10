import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    name: String,
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
  },
  {
    collection: "typeAbsence",
    timestamps: true,
  }
);

const TypeAbsence = mongoose.model("TypeAbsence", schema);
export default TypeAbsence;
