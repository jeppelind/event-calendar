import { useNavigation } from '@react-navigation/native';
import { EntityId } from '@reduxjs/toolkit';
import React from 'react';
import { Animated, useColorScheme, useWindowDimensions, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../utils/color';
import { MyAppIconButton, MyAppText } from '../../utils/Components';
import { selectUserToken } from '../user/userSlice';
import styles from './EventList.style';
import { selectEventById } from './eventsSlice';

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

const EventItem = ({ eventId } : { eventId: EntityId}) => {
  const navigation = useNavigation();
  const userToken = useSelector(selectUserToken);
  const event = useSelector((state) => selectEventById(state, eventId)) as EventProps;
  const {
    name, description, startDate, endDate,
  } = event;
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const backgroundColor = (colorScheme === 'light') ? lightTheme.background : darkTheme.background;

  const swipeMenu = (_: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 0],
    });
    return (
      <Animated.View style={{
        width: '100%',
        // justifyContent: 'center',
        backgroundColor: lightTheme.primary,
        transform: [{ translateX: trans }],
      }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        >
          {userToken && (
            <>
              <MyAppIconButton
                style={styles.buttonInteraction}
                icon="edit"
                onPress={() => navigation.navigate('EditEventModal', { id: eventId.toString() })}
              />
              <MyAppIconButton
                style={styles.buttonInteraction}
                icon="delete"
                onPress={() => navigation.navigate('DeleteEventModal', { id: eventId.toString() })}
              />
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={swipeMenu} rightThreshold={width * 0.2}>
      <Animated.View style={{ backgroundColor }}>
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
      </Animated.View>
    </Swipeable>
  );
};

export default EventItem;
