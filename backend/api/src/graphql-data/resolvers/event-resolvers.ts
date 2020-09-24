import { DateResolver } from 'graphql-scalars';
import { getUpcomingEvents, createEvent, deleteEvent, updateEvent } from "../../db/mongo-connection"
import { Resolvers } from "../resolver-types";
import { EventModel } from "../models";

export const resolvers: Resolvers = {
  Query: {
    getUpcomingEvents: async () => {
      const eventsDoc = await getUpcomingEvents();
      const eventArr: EventModel[] = eventsDoc.map(doc => doc.toObject());
      return eventArr;
    }
  },
  Mutation: {
    createEvent: async (parent, args) => {
      const eventDocument = await createEvent(args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      const eventObj: EventModel = eventDocument.toObject();
      return eventObj;
    },
    deleteEvent: async (parent, args) => {
      console.dir(args)
      const deletionCount = await deleteEvent(args.id);
      return deletionCount;
    },
    updateEvent: async (parent, args) => {
      const updatedDocument = await updateEvent(args.id, args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return updatedDocument.id;
    },
  },
  Event: {
    id: event => event._id
  },
  Date: DateResolver
}
