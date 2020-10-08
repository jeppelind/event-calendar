import React from 'react';
import './EventList.css';
import { EventListProps, EventListItemProps } from "./types";

enum DATES {
  jan,
  feb,
  mar,
  apr,
  maj,
  jun,
  jul,
  aug,
  sep,
  okt,
  nov,
  dec
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
  let formatedDate = '';
  if (endDate && endDate !== startDate) {
    const endDateObj = new Date(endDate);
    if (startDateObj.getMonth() !== endDateObj.getMonth()) {
      formatedDate = `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]} - ${endDateObj.getDate()} ${DATES[endDateObj.getMonth()]}`;
    } else {
      formatedDate = `${startDateObj.getDate()} - ${endDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
    }
  } else {
    formatedDate = `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
  }
  return (
    <div className="event-item">
      <span className="date">{formatedDate}</span>
      <br></br>
      <span className="title">{name}</span>
      <div className="description">{description}</div>
    </div>
  );
}
