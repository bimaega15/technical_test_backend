import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: String,
  },
  {
    collection: "officer",
    timestamps: true,
  }
);

const Officer = mongoose.model("Officer", schema);
export default Officer;
