import { Schema } from "mongoose";

export const eventSchema = new Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
});
