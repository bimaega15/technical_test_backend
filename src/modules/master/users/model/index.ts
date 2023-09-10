import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    email: String,
    username: String,
    password: String,
    isActive: {
      type: Boolean,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const Users = mongoose.model("Users", schema);
export default Users;
