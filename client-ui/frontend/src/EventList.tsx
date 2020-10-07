import React from 'react';
import './EventList.css';
import { EventListProps, EventListItemProps } from "./types";

enum DATES {
  JAN,
  FEB,
  MAR,
  APR,
  MAJ,
  JUN,
  JUL,
  AUG,
  SEP,
  OKT,
  NOV,
  DEC
}

export const EventList = ({ events } : EventListProps) => {
  return (
    <div className="events-container">
      {
        events.map((event) => {
          return <EventListItem key={event.id} id={event.id} name={event.name}
            description={event.description} startDate={event.startDate} endDate={event.endDate}></EventListItem>
        })
      }
    </div>
  );
}

const EventListItem = ({ id, name, description, startDate, endDate }: EventListItemProps) => {
  const startDateObj = new Date(startDate);
  return (
    <div className="event-item">
      <span className="date">{startDateObj.getDate()} {DATES[startDateObj.getMonth()]}</span>
      <br></br>
      <span className="title">{name}</span>
      <div className="description">{description}</div>
    </div>
  );
}
