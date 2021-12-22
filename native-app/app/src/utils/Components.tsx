/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useState } from 'react';
import {
  Text, TextInputProps, TextProps, StyleSheet, Pressable, PressableProps, StyleProp, ViewStyle, Modal, View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    height: 44,
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#666666',
    width: '100%',
  },
  button: {
    height: 44,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#095b91',
  },
  buttonLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: 'white',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  modalParentView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 26,
  },
  modalView: {
    margin: 4,
    backgroundColor: '#d0d0c0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
});

export const MyAppText: FC<TextProps> = (props) => {
  const { children, style } = props;
  return (
    <Text {...props} style={[{ fontFamily: 'Poppins_400Regular', ...(style as Object) }]}>
      {children}
    </Text>
  );
};

export const MyAppHeader: FC<TextProps> = (props) => {
  const { children, style } = props;
  return (
    <Text {...props} style={[styles.header, style]}>
      {children}
    </Text>
  );
};

export const MyAppTextInput: FC<TextInputProps> = (props) => {
  const { children, style } = props;
  return (
    <TextInput {...props} style={[styles.input, style]}>
      {children}
    </TextInput>
  );
};

type CustomButton = PressableProps & {
  title: string,
  style?: StyleProp<ViewStyle> | undefined,
}

export const MyAppButton: FC<CustomButton> = (props) => {
  const { title, style, onPress } = props;

  const getStyle = (isPressed: Boolean) => {
    if (isPressed) {
      return [styles.button, styles.buttonPressed, style];
    }
    return [styles.button, style];
  };

  return (
    <Pressable
      style={({ pressed }) => getStyle(pressed)}
      onPress={onPress}
    >
      <Text style={styles.buttonLabel}>
        {title}
      </Text>
    </Pressable>
  );
};

type MyAppIconButtonProps = PressableProps & {
 icon: any,
};

export const MyAppIconButton: FC<MyAppIconButtonProps> = (props) => {
  const { icon, onPress } = props;
  return (
    <Pressable onPress={onPress}>
      <MaterialIcons name={icon} size={32} color="white" />
    </Pressable>
  );
};

type DatePickerProps = {
  startDate?: Date,
  onClose: (date?: Date) => void,
  visible?: boolean,
}

export const MyDatePickerAndroid: FC<DatePickerProps> = ({ onClose, startDate, visible }) => {
  const [date, setDate] = useState(startDate || new Date());

  const onChange = (_evt: any, selectedDate: Date | undefined) => {
    const newDate = selectedDate || date;
    setDate(newDate);
    onClose(newDate);
  };

  if (!visible) {
    return null;
  }

  return (
    <DateTimePicker
      testID="dateTimePicker"
      mode="date"
      value={date}
      is24Hour
      onChange={onChange}
      style={{ width: '100%' }}
    />
  );
};

export const MyDatePickerIOS: FC<DatePickerProps> = ({ startDate, onClose, visible }) => {
  const [date, setDate] = useState(startDate || new Date());

  const onChange = (_evt: any, selectedDate: Date | undefined) => {
    const newDate = selectedDate || date;
    setDate(newDate);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalParentView}>
        <View style={styles.modalView}>
          <DateTimePicker
            mode="date"
            value={date}
            is24Hour
            display="spinner"
            onChange={onChange}
            style={{ width: '100%', backgroundColor: 'white' }}
            textColor="black"
          />
          <View style={{ width: '100%', padding: 10 }}>
            <MyAppButton title="Confirm" onPress={() => onClose(date)} />
            <MyAppButton title="Cancel" onPress={() => onClose()} style={{ marginTop: 10, backgroundColor: '#595959' }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
