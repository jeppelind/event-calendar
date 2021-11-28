import React from 'react';
import { View } from 'react-native';
import { MyAppText } from '../../utils/Components';
import styles from './EventList.style';

export type EventProps = {
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

const YearDisplay = ({ endDate }: { endDate: string }) => {
  const endYear = new Date(endDate).getFullYear();
  if (endYear !== new Date().getFullYear()) {
    return <MyAppText style={styles.year}>{` ${endYear}`}</MyAppText>;
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

export default EventItem;
