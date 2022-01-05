import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { RootStackParamList } from '../../types/global/react-navigation';
import { MyAppButton, MyAppHeader, MyAppText } from '../../utils/Components';
import { selectUserToken } from '../user/userSlice';
import { EventProps } from './EventItem';
import { deleteEvent, selectEventById } from './eventsSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

const DeleteEventModal = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'DeleteEventModal'>>();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = route.params;
  const token = useSelector(selectUserToken);
  const event = useSelector((state) => selectEventById(state, id)) as EventProps;
  const { name } = event;

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteEvent({ id, token }));
      unwrapResult(res);
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <MyAppHeader>Delete event</MyAppHeader>
      <View style={styles.content}>
        <MyAppText style={{ fontSize: 17, marginVertical: 20 }}>{name}</MyAppText>
        { isLoading
          ? (
            <View style={styles.buttons}>
              <MyAppText style={{ flex: 1, textAlign: 'center' }}>Deleting...</MyAppText>
            </View>
          )
          : (
            <View style={styles.buttons}>
              <MyAppButton secondary title="Cancel" style={styles.button} onPress={() => navigation.goBack()} />
              <MyAppButton title="Delete" style={[styles.button, { backgroundColor: 'darkred' }]} onPress={onConfirm} />
            </View>
          )}
      </View>
    </View>
  );
};

export default DeleteEventModal;
