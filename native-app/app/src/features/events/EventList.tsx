import { EntityId } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import {
  FlatList, View, ListRenderItem,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { MyAppText } from '../../utils/Components';
import EventItem from './EventItem';
import styles from './EventList.style';
import { fetchEvents, selectEventIds, selectEventsLoading, selectEventsTotal } from './eventsSlice';

const EventList = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  const eventsPerFetch = 25;
  const dispatch = useAppDispatch();
  const eventIds = useSelector(selectEventIds);
  const isLoadingEvents = useSelector(selectEventsLoading);
  const total = useSelector(selectEventsTotal);

  const renderItem: ListRenderItem<EntityId> = (item) => (
    <EventItem eventId={item.item} />
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
    // if (!isAllDataFetched && !isLoadingEvents) {
    //   setIsLoadingEvents(true);
    //   setCurrentIdx((prevValue) => prevValue + eventsPerFetch);
    //   console.log(eventIds.length);
    // }
    console.log('end reached');
    if (!isLoadingEvents) {
      console.log('need more events');
      setCurrentIdx((value) => value + eventsPerFetch);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const newEvents = await fetchEvents(currentIdx, currentIdx + eventsPerFetch);
  //     setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  //     if (newEvents.length < eventsPerFetch) {
  //       setIsAllDataFetched(true);
  //     }
  //     setIsLoadingEvents(false);
  //   };
  //   fetchData();
  // }, [currentIdx]);

  useEffect(() => {
    console.log(`fetch events ${currentIdx}`);
    dispatch(fetchEvents({ startIndex: currentIdx, endIndex: currentIdx + eventsPerFetch }));
  }, [dispatch, currentIdx]);

  useEffect(() => {
    console.log(`total changed to ${total}`);
  }, [total]);

  useEffect(() => {
    console.log(`is loading: ${isLoadingEvents}`);
  }, [isLoadingEvents]);

  return (
    <FlatList
      style={styles.eventList}
      data={eventIds}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
    />
  );
};

export default EventList;
