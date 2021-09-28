import React, { useState, useEffect } from 'react';
import { Grid, Container, Placeholder, Button } from 'semantic-ui-react';
import './EventList.less';

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

type EventListItemProps = {
  id: string,
  name: string,
  description?: string,
  startDate: string,
  endDate: string,
}

export const EventList = () => {
  const [events, setEvents] = useState<EventListItemProps[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fetchedAllEvents, setFetchedAllEvents] = useState(false);
  const eventsPerFetch = 50;

  useEffect(() => {
    const asyncFetch = async () => {
      const newEvents = await fetchEvents(currentIdx, currentIdx + eventsPerFetch);
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setFetchedAllEvents(newEvents.length < eventsPerFetch);
    }
    asyncFetch();
  }, [currentIdx]);

  const btnClick = async () => {
    setCurrentIdx(currentIdx + eventsPerFetch);
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
        description={event.description} startDate={event.startDate} endDate={event.endDate} />
    ));
  }

  return (
    <div className="events-container">
      {content}
      {!fetchedAllEvents &&
        <Button onClick={btnClick}>Load more</Button>
      }
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
            <span className="date">{formatedDate} <YearDisplay endDate={endDate} /></span>
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

const YearDisplay = ({ endDate }: { endDate: string }) => {
  const endYear = new Date(endDate).getFullYear();
  if (endYear !== new Date().getFullYear()) {
    return <span className="year">{endYear}</span>;
  }
  return null;
}

const fetchEvents = async (startIndex: number, endIndex: number) => {
  const query = `
    {
      getUpcomingEvents(startIndex: ${startIndex}, endIndex: ${endIndex}) {
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

function getDayLabel(date: Date) {
  const todayLabel = 'Idag';
  const tomorrowLabel = 'Imorgon';
  const dateToday = new Date();
  const dateTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
  if (date.toDateString() === dateToday.toDateString()) {
    return todayLabel;
  }
  if (date.toDateString() === dateTomorrow.toDateString()) {
    return tomorrowLabel;
  }
  return null;
}

function formatDate(startDate: string, endDate: string) {
  const startDateObj = new Date(startDate);
  const startDayLabel = getDayLabel(startDateObj);

  if (endDate !== startDate) {
    const endDateObj = new Date(endDate);
    const endDayLabel = getDayLabel(endDateObj);
    const ends = (endDayLabel) ? endDayLabel : `${endDateObj.getDate()} ${DATES[endDateObj.getMonth()]}`;
    let starts;
    if (startDateObj.getMonth() !== endDateObj.getMonth() || endDayLabel) {
      starts = (startDayLabel) ? startDayLabel : `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
    } else {
      starts = (startDayLabel) ? startDayLabel : `${startDateObj.getDate()}`;
    }
    return `${starts} - ${ends}`;
  }
  return (startDayLabel) ? startDayLabel : `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
}
