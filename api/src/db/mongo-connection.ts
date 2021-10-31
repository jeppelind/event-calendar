import { model, connect, Schema, Document } from "mongoose";

export interface EventDocument extends Document {
  name: string,
  description?: string,
  startDate: Date,
  endDate?: Date,
  errors: any,
}

export interface UserDocument extends Document {
  name: string,
  token: string,
  role: number,
}

export const createMongoConnection = async () => {
  await connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

const eventSchema = new Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
});

export const EventDBModel = model<EventDocument>('Event', eventSchema);

const createEvent = async (name: string, startDate: string, endDate?: string, description?: string) => {
  const document = await EventDBModel.create({
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  });
  return document.toObject();
}

const deleteEvent = async (id: string) => {
  const result = await EventDBModel.deleteOne({ _id: id });
  return result.deletedCount > 0 ? id : '';
}

const updateEvent = async (id: string, name: string, startDate: string, endDate?: string, description?: string) => {
  const document = await EventDBModel.findByIdAndUpdate(id, {
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  }, {
    new: true,
  });
  return document ? document.toObject() : null;
}

const getUpcomingEvents = async () => {
  const res = await EventDBModel.find().where('endDate').gte(Date.now()).sort({ startDate: 'ascending' });
  const objectArr = res.map(doc => doc.toObject());
  return objectArr;
}

const userSchema = new Schema({
  name: String,
  token: String,
  role: Number,
});

export const UserDBModel = model<UserDocument>('User', userSchema);

const getUserByToken = async (token: string) => {
  const document = await UserDBModel.findOne({ token }).select({ token: 0, password: 0 });
  return document ? document.toObject() : null;
}

export default {
  getUpcomingEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  getUserByToken,
}
