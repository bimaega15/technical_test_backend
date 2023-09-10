import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    typeMapping: {
      type: String,
      enum: ["client", "employee", "admin"],
    },
    usersRef: {
      type: Types.ObjectId,
      ref: "Users",
    },
    usersMappingRef: {
      type: String,
    },
  },
  {
    collection: "usersMapping",
    timestamps: true,
  }
);

const UsersMapping = mongoose.model("UsersMapping", schema);
export default UsersMapping;
