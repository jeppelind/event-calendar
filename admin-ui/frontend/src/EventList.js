import React, { useState, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { useAuth } from './utils/auth';
import './EventList.css';

const DATES = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec'
]

const fetchEvents = async (token) => {
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
      body: JSON.stringify({ query, token })
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

export const EventList = () => {
  const [events, setEvents] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    const asyncFetch = async () => {
      const result = await fetchEvents(auth.user.token);
      setEvents(result);
    }
    asyncFetch();
  }, [auth.user.token]);

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

const EventListItem = ({ name, description, startDate, endDate }) => {
  const formatedDate = formatDate(startDate, endDate);
  return (
    <div className="event-item">
      <Grid stackable centered container columns={3}>
        <Grid.Row>
          <Grid.Column stretched mobile={16} tablet={4} computer={3} largeScreen={2}>
            <span className="date">{formatedDate}</span>
          </Grid.Column>
          <Grid.Column stretched mobile={16} tablet={12} computer={9} largeScreen={8}>
            <span className="title">{name}</span>
            <span className="description">{description}</span>
          </Grid.Column>
          <Grid.Column mobile={6} tablet={6} computer={3} largeScreen={2} className='item-buttons'>
            <Button color='purple'>Edit</Button>
            <Button className='ui icon button'><i aria-hidden='true' className='trash icon'></i></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

function formatDate(startDate, endDate) {
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
