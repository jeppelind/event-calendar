import React, { useEffect, useState } from 'react';
import {
  FlatList, View, ListRenderItem,
} from 'react-native';
import { MyAppText } from '../../utils/Components';
import styles from './EventList.style';

type EventProps = {
  id: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
}

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
    const ends = endDayLabel || `${endDateObj.getDate()} ${DATES[endDateObj.getMonth()]}`;
    let starts;
    if (startDateObj.getMonth() !== endDateObj.getMonth() || endDayLabel) {
      starts = startDayLabel || `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
    } else {
      starts = startDayLabel || `${startDateObj.getDate()}`;
    }
    return `${starts} - ${ends}`;
  }
  return startDayLabel || `${startDateObj.getDate()} ${DATES[startDateObj.getMonth()]}`;
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
    const response = await fetch('http://192.168.10.179:9895/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
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
};

const YearDisplay = ({ endDate }: { endDate: string }) => {
  const endYear = new Date(endDate).getFullYear();
  if (endYear !== new Date().getFullYear()) {
    // eslint-disable-next-line react/jsx-one-expression-per-line
    return <MyAppText style={styles.year}> {endYear}</MyAppText>;
  }
  return null;
};

const EventItem = ({ event }: { event: EventProps }) => {
  const {
    name, description, startDate, endDate,
  } = event;
  return (
    <View style={styles.event}>
      <View style={styles.dateParent}>
        <MyAppText style={styles.date}>{formatDate(startDate, endDate)}</MyAppText>
        <YearDisplay endDate={endDate} />
      </View>
      <MyAppText style={styles.label}>{name}</MyAppText>
      {
        description !== '' && <MyAppText style={styles.description}>{description}</MyAppText>
      }
    </View>
  );
};

const EventList = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const eventsPerFetch = 25;

  const renderItem: ListRenderItem<EventProps> = ({ item }) => (
    <EventItem event={item} />
  );

  const onEndReached = () => {
    setCurrentIdx((prevValue) => prevValue + eventsPerFetch);
  };

  useEffect(() => {
    const fetchData = async () => {
      const newEvents = await fetchEvents(currentIdx, currentIdx + eventsPerFetch);
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    };
    fetchData();
  }, [currentIdx]);

  const footer = () => <View><MyAppText>APANSSON</MyAppText></View>;

  return (
    <FlatList
      style={styles.eventList}
      data={events}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
    />
  );
};

export default EventList;
