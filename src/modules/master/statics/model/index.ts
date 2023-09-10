import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    clientRef: {
      type: Types.ObjectId,
      ref: "Client",
    },
    name: String,
    staticType: {
      type: String,
      enum: ["married", "religion", "education"],
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    collection: "statics",
    timestamps: true,
  }
);

const Statics = mongoose.model("Statics", schema);
export default Statics;
