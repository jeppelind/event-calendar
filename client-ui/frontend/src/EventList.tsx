import React, { useState, useEffect } from 'react';
import { Grid, Container, Placeholder } from 'semantic-ui-react';
import './EventList.css';
import { EventListItemProps } from "./types";

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

export const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const asyncFetch = async () => {
      const result = await fetchEvents();
      setEvents(result);
    }
    asyncFetch();
  }, []);

  const fetchEvents = async () => {
    const query = `
      {
        getUpcomingEvents {
          id
          name
          description
          startDate
          endDate
        }
      }`;
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      return result.data.getUpcomingEvents;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  let content;
  if (events.length === 0) {
    content =
      <Container text>
        <PlaceholderItems />
        <PlaceholderItems />
      </Container>
  } else {
    content = events.map((event: EventListItemProps) => (
      <EventListItem key={event.id} id={event.id} name={event.name}
        description={event.description} startDate={event.startDate} endDate={event.endDate}></EventListItem>
    ));
  }

  return (
    <div className="events-container">
      {content}
    </div>
  );
}

const PlaceholderItems = () => {
  return (
    <Placeholder fluid>
        <Placeholder.Header>
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
  )
}

const EventListItem = ({ name, description, startDate, endDate }: EventListItemProps) => {
  const formatedDate = formatDate(startDate, endDate);
  return (
    <div className="event-item">
      <Grid centered container columns={2}>
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
