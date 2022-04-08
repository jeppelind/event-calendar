import { EntityId, unwrapResult } from '@reduxjs/toolkit';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import {
  FlatList, View, ListRenderItem,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { MyAppText } from '../../utils/Components';
import EventItem from './EventItem';
import styles from './EventList.style';
import {
  clearEvents,
  fetchEvents,
  selectEventIds,
  selectEventsLoading,
} from './eventsSlice';

const EventList = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const eventsPerFetch = 25;
  const dispatch = useAppDispatch();
  const eventIds = useSelector(selectEventIds);
  const isLoadingEvents = useSelector(selectEventsLoading);

  const renderItem: ListRenderItem<EntityId> = (item) => (
    <EventItem eventId={item.item} />
  );

  const footer = () => {
    if (isAllDataFetched) {
      return <View style={styles.footer}><MyAppText>{i18next.t('events.noMoreEvents')}</MyAppText></View>;
    }
    if (isLoadingEvents) {
      return <View style={styles.footer}><MyAppText>{i18next.t('events.loading')}</MyAppText></View>;
    }
    return <View style={styles.footer} />;
  };

  const onEndReached = () => {
    if (!isAllDataFetched && !isLoadingEvents) {
      setCurrentIdx((value) => value + eventsPerFetch);
    }
  };

  const fetchData = async (startIndex: number, endIndex: number) => {
    try {
      const eventParams = { startIndex, endIndex };
      const res = await dispatch(fetchEvents(eventParams));
      unwrapResult(res);
      if (res.payload.length === 0) {
        setIsAllDataFetched(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = async () => {
    if (!isLoadingEvents && !isRefreshing) {
      setIsRefreshing(true);
      setCurrentIdx(0);
      dispatch(clearEvents());
      await fetchData(0, eventsPerFetch);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isRefreshing) {
      fetchData(currentIdx, currentIdx + eventsPerFetch);
    }
  }, [dispatch, currentIdx]);

  return (
    <FlatList
      style={styles.eventList}
      data={eventIds}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      ListFooterComponent={footer}
    />
  );
};

export default EventList;
