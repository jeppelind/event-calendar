import React from 'react';
import { EventListProps, EventListItemProps } from "./types";

export const EventList = ({ events } : EventListProps) => {
  return (
    <ul>
      {
        events.map((event) => {
          return <EventListItem key={event.id} id={event.id} name={event.name}></EventListItem>
        })
      }
    </ul>
  );
}

const EventListItem = ({ id, name }: EventListItemProps) => {
  return <li>{name}</li>
}
