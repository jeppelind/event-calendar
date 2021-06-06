import { Resolvers } from "../resolver-types";
import { EventModel } from "../models";
import db from "../../db/mongo-connection"
import { authorize, Roles } from '../../permissions';
import { clearEventCache, getEventCache, setEventCache } from '../../cache/cache';
import { GraphQLScalarType } from 'graphql';
import { getEventsSlice } from "../../utils";

export const resolvers: Resolvers = {
  Query: {
    getUpcomingEvents: async (parent, args, request) => {
      authorize(request.user.role, Roles.READ);
      const cachedEvents = await getEventCache();
      if (cachedEvents) {
        return getEventsSlice(cachedEvents, args.startIndex, args.endIndex);
      }
      const events: EventModel[] = await db.getUpcomingEvents();
      await setEventCache(events);
      return getEventsSlice(events, args.startIndex, args.endIndex);
    }
  },
  Mutation: {
    createEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      clearEventCache();
      const eventObj: EventModel = await db.createEvent(args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return eventObj;
    },
    deleteEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      clearEventCache();
      const deletedId = await db.deleteEvent(args.id);
      return deletedId;
    },
    updateEvent: async (parent, args, request) => {
      authorize(request.user.role, Roles.WRITE);
      clearEventCache();
      const eventObj: EventModel = await db.updateEvent(args.id, args.input.name, args.input.startDate, args.input.endDate, args.input.description);
      return eventObj;
    },
  },
  Event: {
    id: event => event._id
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      // cache returns string
      return (typeof value === 'string') ? value : value.toISOString();
    },
  })
}
