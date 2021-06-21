import { EventModel } from "./graphql-data/models";

export const getEventsSlice = (arr: EventModel[], startIdx: number, endIdx: number) => {
  const start = startIdx || 0;
  const end = endIdx || arr.length;
  return arr.slice(start, end);
}
