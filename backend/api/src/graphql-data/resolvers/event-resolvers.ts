import { getUpcomingEvents, createEvent, EventDBModel } from "../../db/mongo-connection"
import { Document } from "mongoose";
import { Resolvers, Event } from "../resolver-types";
import { EventModel } from "../models";

// const EVENTS: EventModel[] = [
//   {
//     _id: '1',
//     name: 'event1',
//     description: 'nope'
//   },
//   {
//     _id: '2',
//     name: 'event2',
//     description: 'some info'
//   }
// ];

export const resolvers: Resolvers = {
  Query: {
    getUpcomingEvents: async () => {
      const eventsDoc = await getUpcomingEvents();
      console.log(eventsDoc.length)
      const eventArr: EventModel[] = eventsDoc.map(doc => doc.toObject());
      console.dir(eventArr);
      return eventArr;
    }
  },
  Mutation: {
    createEvent: async (parent, args) => {
      const eventDocument = await createEvent(args.input.name, '2020-02-02', '2020-02-02', args.input.description)
      const eventObj: EventModel = eventDocument.toObject();
      return eventObj;
    }
  },
  Event: {
    id: event => event._id
  }
}


// interface Event {
//   name: string;
//   description?: string;
//   startDate: string;
//   endDate?: string;
// }

// export const eventResolvers = {
//   Query: {
//     getUpcomingEvents: async () => {
//       try {
//         const res = await getUpcomingEvents();
//         Promise.resolve(res);
//       } catch(err) {
//         Promise.reject(err);
//       }
//     },
//   },
//   Mutations: {
//     createEvent: async () => {

//     }
//   }
// }

