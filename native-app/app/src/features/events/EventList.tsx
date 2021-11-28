import React, { useEffect, useState } from 'react';
import {
  FlatList, View, ListRenderItem,
} from 'react-native';
import { MyAppText } from '../../utils/Components';
import EventItem, { EventProps } from './EventItem';
import styles from './EventList.style';

const fetchEvents = async (startIndex: number, endIndex: number): Promise<[]> => {
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

const EventList = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  const eventsPerFetch = 25;

  const renderItem: ListRenderItem<EventProps> = ({ item }) => (
    <EventItem event={item} />
  );

  const footer = () => {
    if (isAllDataFetched) {
      return <View style={styles.footer}><MyAppText>No more events</MyAppText></View>;
    }
    if (isLoadingEvents) {
      return <View style={styles.footer}><MyAppText>Loading...</MyAppText></View>;
    }
    return <View style={styles.footer} />;
  };

  const onEndReached = () => {
    if (!isAllDataFetched && !isLoadingEvents) {
      setIsLoadingEvents(true);
      setCurrentIdx((prevValue) => prevValue + eventsPerFetch);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const newEvents = await fetchEvents(currentIdx, currentIdx + eventsPerFetch);
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      if (newEvents.length < eventsPerFetch) {
        setIsAllDataFetched(true);
      }
      setIsLoadingEvents(false);
    };
    fetchData();
  }, [currentIdx]);

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
