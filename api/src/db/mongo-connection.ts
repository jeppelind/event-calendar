import { model, connect, Schema } from "mongoose";

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

export const EventDBModel = model('Event', eventSchema);

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
  return result.deletedCount;
}

const updateEvent = async (id: string, name: string, startDate: string, endDate?: string, description?: string) => {
  const document = await EventDBModel.findByIdAndUpdate(id, {
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  });
  return document ? document.id : null;
}

const getUpcomingEvents = async () => {
  const res = await EventDBModel.find().where('startDate').gte(new Date());
  const objectArr = res.map(doc => doc.toObject());
  return objectArr;
}

const userSchema = new Schema({
  name: String,
  token: String,
  role: Number,
});

export const UserDBModel = model('User', userSchema);

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
