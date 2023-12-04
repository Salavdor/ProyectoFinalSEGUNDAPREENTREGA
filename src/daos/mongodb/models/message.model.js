import mongoose, { Schema, model } from "mongoose";

const collectionName = "message";

const collectionSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const messageModel = model(collectionName, collectionSchema);
