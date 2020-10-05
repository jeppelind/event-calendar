import { DateResolver } from 'graphql-scalars';
import { Resolvers } from "../resolver-types";
import { EventModel } from "../models";
import db from "../../db/mongo-connection"
import { authorize, Roles } from '../../permissions';

export const resolvers: Resolvers = {
  Query: {
    getUpcomingEvents: async (parent, args, request) => {
      authorize(request.user.role, Roles.READ);
      const events: EventModel[] = await db.getUpcomingEvents();
      return events;
    }
  },
  Mutation: {
    createEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      const eventObj: EventModel = await db.createEvent(args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return eventObj;
    },
    deleteEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      const deletionCount = await db.deleteEvent(args.id);
      return deletionCount;
    },
    updateEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      const updatedDocumentId = await db.updateEvent(args.id, args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return updatedDocumentId;
    },
  },
  Event: {
    id: event => event._id
  },
  Date: DateResolver
}
