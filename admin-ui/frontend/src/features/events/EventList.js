import React, { useEffect } from 'react';
import { Container, Grid, Placeholder } from 'semantic-ui-react';
import './EventList.css';
import DeleteEventButton from './DeleteEventButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken } from '../user/userSlice';
import { fetchEvents, selectEventById, selectEventIds, selectEventsStatus } from './eventsSlice';
import { EditEventModal } from './EditEventModal';

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
  }, [dispatch, userToken]);

  let content;
  if (status === 'pending') {
    content =
      <Container text>
        <PlaceholderItems />
      </Container>
  } else if (status === 'completed') {
    content = eventIds.map(eventId => (
      <EventListItem key={eventId} eventId={eventId} />
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
  )
}

const EventListItem = ({ eventId }) => {
  const event = useSelector(state => selectEventById(state, eventId));
  const formatedDate = formatDate(event.startDate, event.endDate);
  return (
    <div className="event-item">
      <Grid centered container columns={3}>
        <Grid.Row>
          <Grid.Column stretched mobile={16} tablet={3} computer={3} largeScreen={2}>
            <span className="date">{formatedDate}</span>
          </Grid.Column>
          <Grid.Column stretched mobile={10} tablet={10} computer={9} largeScreen={8}>
            <span className="title">{event.name}</span>
            <span className="description">{event.description}</span>
          </Grid.Column>
          <Grid.Column mobile={6} tablet={3} computer={3} largeScreen={2} className='item-buttons'>
            <EditEventModal eventId={event.id} />
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
