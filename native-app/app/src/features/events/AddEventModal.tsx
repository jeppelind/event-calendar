import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import {
  View, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import {
  MyAppButton, MyAppHeader, MyAppTextInput, MyDateButton, MyDatePickerAndroid, MyDatePickerIOS,
} from '../../utils/Components';
import { selectUser } from '../user/userSlice';
import { addEvent } from './eventsSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 26,
  },
  datesParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

const AddEventModal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(0));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

  const endDateLabel = (endDate < startDate) ? 'End date' : endDate.toDateString();

  const updateStartDate = (newDate: Date | undefined) => {
    setShowStartDatePicker(false);
    if (newDate) {
      setStartDate(newDate);
    }
  };

  const updateEndDate = (newDate: Date | undefined) => {
    setShowEndDatePicker(false);
    if (newDate) {
      setEndDate((newDate < startDate) ? startDate : newDate);
    }
  };

  const onSubmit = async () => {
    try {
      const res = await dispatch(addEvent({
        title,
        description,
        startDate,
        endDate,
        token: user.token,
      }));
      unwrapResult(res);
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MyAppHeader>Add new event</MyAppHeader>
        <MyAppTextInput
          value={title}
          placeholder="Title"
          onChangeText={setTitle}
        />
        <MyAppTextInput
          value={description}
          placeholder="Description"
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
          style={{ height: 70 }}
        />
        <View style={styles.datesParent}>
          <MyDateButton
            style={styles.dateButton}
            title={startDate.toDateString()}
            onPress={() => setShowStartDatePicker(true)}
          />
          <MyDateButton
            style={styles.dateButton}
            title={endDateLabel}
            onPress={() => setShowEndDatePicker(true)}
          />
        </View>
        <View style={styles.buttons}>
          <MyAppButton secondary title="Cancel" style={styles.button} onPress={() => navigation.goBack()} />
          <MyAppButton title="Create" style={styles.button} onPress={onSubmit} />
        </View>
        {Platform.OS === 'ios'
          ? (
            <>
              <MyDatePickerIOS visible={showStartDatePicker} onClose={updateStartDate} />
              <MyDatePickerIOS visible={showEndDatePicker} onClose={updateEndDate} />
            </>
          ) : (
            <>
              <MyDatePickerAndroid visible={showStartDatePicker} onClose={updateStartDate} />
              <MyDatePickerAndroid visible={showEndDatePicker} onClose={updateEndDate} />
            </>
          )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddEventModal;
