import React from 'react';
import { Grid } from 'semantic-ui-react';
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

const EventListItem = ({ name, description, startDate, endDate }: EventListItemProps) => {
  const formatedDate = formatDate(startDate, endDate);
  return (
    <div className="event-item">
      <Grid stackable centered container columns={2}>
        <Grid.Row stretched>
          <Grid.Column mobile={16} tablet={4} computer={3} largeScreen={2}>
            <span className="date">{formatedDate}</span>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={9} largeScreen={8}>
            <span className="title">{name}</span>
            <span className="description">{description}</span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

function formatDate(startDate: string, endDate: string) {
  const startDateObj = new Date(startDate);
  if (endDate !== startDate) {
    const endDateObj = new Date(endDate);
    if (startDateObj.getMonth() !== endDateObj.getMonth()) {
      return `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]} - ${endDateObj.getDate()} ${DATES[endDateObj.getMonth()]}`;
    } else {
      return `${startDateObj.getDate()} - ${endDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
    }
  } else {
    return `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
  }
}
