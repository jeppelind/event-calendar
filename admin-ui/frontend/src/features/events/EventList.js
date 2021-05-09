import React, { useEffect } from 'react';
import { Grid, Button, Placeholder } from 'semantic-ui-react';
import './EventList.css';
import DeleteEventButton from './DeleteEventButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken } from '../user/userSlice';
import { fetchEvents, selectEventById, selectEventIds, selectEventsStatus } from './eventsSlice';

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

export const EventList = () => {
  const dispatch = useDispatch();
  const userToken = useSelector(selectUserToken);
  const status = useSelector(selectEventsStatus);
  const eventIds = useSelector(selectEventIds);

  useEffect(() => {
    dispatch(fetchEvents(userToken));
    console.log('run fetch')
  }, [dispatch, userToken]);

  let content;
  if (status === 'pending') {
    content =
    <Grid centered container>
      <Grid.Column stretched mobile={16} tablet={12} computer={9} largeScreen={8}>
      <Placeholder fluid inverted>
        <Placeholder.Header>
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      </Grid.Column>
    </Grid>
  } else if (status === 'completed') {
    content = eventIds.map(eventId => (
      <EventListItem key={eventId} eventId={eventId} />
    ))
  }

  return (
    <div className="events-container">
      {content}
    </div>
  );
}

const EventListItem = ({ eventId }) => {
  const event = useSelector(state => selectEventById(state, eventId));
  const formatedDate = formatDate(event.startDate, event.endDate);
  return (
    <div className="event-item">
      <Grid stackable centered container columns={3}>
        <Grid.Row>
          <Grid.Column stretched mobile={16} tablet={4} computer={3} largeScreen={2}>
            <span className="date">{formatedDate}</span>
          </Grid.Column>
          <Grid.Column stretched mobile={16} tablet={12} computer={9} largeScreen={8}>
            <span className="title">{event.name}</span>
            <span className="description">{event.description}</span>
          </Grid.Column>
          <Grid.Column mobile={6} tablet={6} computer={3} largeScreen={2} className='item-buttons'>
            <Button color='purple'>Edit</Button>
            <DeleteEventButton id={event.id}></DeleteEventButton>
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
