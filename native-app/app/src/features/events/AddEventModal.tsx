import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  MyAppButton, MyAppHeader, MyAppTextInput, MyDatePickerAndroid, MyDatePickerIOS,
} from '../../utils/Components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 26,
  },
});

const AddEventModal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const updateDate = (newDate: Date | undefined) => {
    setShow(false);
    if (newDate) {
      setStartDate(newDate);
    }
  };

  return (
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
        numberOfLines={4}
        style={{ height: 90 }}
      />
      <MyAppButton title={startDate.toDateString()} onPress={() => setShow(true)} />
      {Platform.OS === 'ios'
        ? (
          <MyDatePickerIOS visible={show} onClose={updateDate} />
        ) : (
          <MyDatePickerAndroid visible={show} onClose={updateDate} />
        )}
    </View>
  );
};

export default AddEventModal;
