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

export const createEvent = async (name: string, startDate: string, endDate?: string, description?: string) => {
  const document = await EventDBModel.create({
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  });
  return document;
}

export const deleteEvent = async (id: string) => {
  const result = await EventDBModel.deleteOne({ _id: id });
  return result.deletedCount;
}

export const updateEvent = async (id: string, name: string, startDate: string, endDate?: string, description?: string) => {
  const document = await EventDBModel.findByIdAndUpdate(id, {
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  });
  return document;
}

export const getUpcomingEvents = async () => {
  const res = await EventDBModel.find().where('startDate').gte(new Date());
  return res;
}
