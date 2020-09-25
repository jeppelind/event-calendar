import { DateResolver } from 'graphql-scalars';
import { Resolvers } from "../resolver-types";
import { EventModel } from "../models";
import db from "../../db/mongo-connection"

export const resolvers: Resolvers = {
  Query: {
    getUpcomingEvents: async () => {
      const events: EventModel[] = await db.getUpcomingEvents();
      return events;
    }
  },
  Mutation: {
    createEvent: async (parent, args) => {
      const eventObj: EventModel = await db.createEvent(args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return eventObj;
    },
    deleteEvent: async (parent, args) => {
      const deletionCount = await db.deleteEvent(args.id);
      return deletionCount;
    },
    updateEvent: async (parent, args) => {
      const updatedDocumentId = await db.updateEvent(args.id, args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return updatedDocumentId;
    },
  },
  Event: {
    id: event => event._id
  },
  Date: DateResolver
}
