import { eventSchema } from "./schemas";
import { model, connect } from "mongoose";

const EventModel = model('Event', eventSchema);

connect('mongodb://localhost:27017/event_calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

export const createEvent = async (name: string, startDate: string, endDate?: string, description?: string) => {
  try {
    const document = await EventModel.create({
      name,
      description,
      startDate: new Date(startDate),
      endDate: (endDate) ? new Date(endDate) : new Date(startDate),
    });
    return document;
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export const deleteEvent = async (id: string) => {
  try {
    const result = await EventModel.deleteOne({ _id: id });
    return result;
  } catch(err) {
    console.error(err);
  }
}

export const updateEvent = async (id: string, name: string, startDate: string, endDate?: string, description?: string) => {
  const document = EventModel.findByIdAndUpdate(id, {
    name,
    description,
    startDate: new Date(startDate),
    endDate: (endDate) ? new Date(endDate) : new Date(startDate),
  });
  return document;
}

export const getUpcomingEvents = async () => {
  const res = await EventModel.find().where('startDate').gte(new Date());
  return res;
}
