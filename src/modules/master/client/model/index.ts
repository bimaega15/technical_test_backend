import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: String,
    address: String,
    phoneNumber: String,
    isActive: {
      type: Boolean,
    },
    userCreate: {
      type: Types.ObjectId,
      ref: "Users",
    },
    userUpdate: {
      type: Types.ObjectId,
      ref: "Users",
    },
    usersMappingRef: {
      type: String
    }
  },
  {
    collection: "client",
    timestamps: true,
  }
);

const Client = mongoose.model("Client", schema);
export default Client;
