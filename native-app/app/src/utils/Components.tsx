/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useState } from 'react';
import {
  Text, TextInputProps, TextProps, StyleSheet, Pressable,
  PressableProps, StyleProp, ViewStyle, Modal, View, useColorScheme,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { darkTheme, lightTheme } from './color';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins_400Regular',
    color: lightTheme.text,
  },
  textDark: {
    color: darkTheme.text,
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    height: 44,
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: lightTheme.input,
  },
  inputDark: {
    backgroundColor: darkTheme.input,
    color: 'white',
  },
  header: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: lightTheme.header,
    width: '100%',
  },
  headerDark: {
    color: darkTheme.header,
  },
  button: {
    height: 44,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.primary,
  },
  buttonSecondary: {
    backgroundColor: '#7a7a7a',
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
    backgroundColor: lightTheme.background,
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
  modalViewDark: {
    backgroundColor: darkTheme.background,
  },
});

export const MyAppText: FC<TextProps> = (props) => {
  const { children, style } = props;
  const colorScheme = useColorScheme();
  const darkStyle = colorScheme === 'dark' ? styles.textDark : null;
  return (
    <Text {...props} style={[styles.text, darkStyle, style]}>
      {children}
    </Text>
  );
};

export const MyAppHeader: FC<TextProps> = (props) => {
  const { children, style } = props;
  const colorScheme = useColorScheme();
  const darkStyle = colorScheme === 'dark' ? styles.headerDark : null;
  return (
    <Text {...props} style={[styles.header, darkStyle, style]}>
      {children}
    </Text>
  );
};

export const MyAppTextInput: FC<TextInputProps> = (props) => {
  const { children, style } = props;
  const colorScheme = useColorScheme();
  const darkStyle = colorScheme === 'dark' ? styles.inputDark : null;
  return (
    <TextInput {...props} style={[styles.input, darkStyle, style]}>
      {children}
    </TextInput>
  );
};

type CustomButton = PressableProps & {
  title: string,
  style?: StyleProp<ViewStyle> | undefined,
  secondary?: boolean,
}

export const MyAppButton: FC<CustomButton> = (props) => {
  const {
    title, style, secondary, onPress,
  } = props;

  const secondaryStyle = (secondary) ? styles.buttonSecondary : null;
  const getStyle = (isPressed: Boolean) => {
    if (isPressed) {
      return [styles.button, styles.buttonPressed, secondaryStyle, style];
    }
    return [styles.button, secondaryStyle, style];
  };

  return (
    <Pressable
      style={({ pressed }) => getStyle(pressed)}
      onPress={onPress}
    >
      <Text style={[styles.buttonLabel]}>
        {title}
      </Text>
    </Pressable>
  );
};

type MyAppIconButtonProps = PressableProps & {
 icon: any,
 style?: StyleProp<ViewStyle> | undefined,
};

export const MyAppIconButton: FC<MyAppIconButtonProps> = (props) => {
  const { icon, style, onPress } = props;
  return (
    <Pressable style={style} onPress={onPress}>
      <MaterialIcons name={icon} size={32} color="white" />
    </Pressable>
  );
};

type MyDateButtonProps = PressableProps & {
  title: string,
  style?: StyleProp<ViewStyle> | undefined,
 };

export const MyDateButton: FC<MyDateButtonProps> = (props) => {
  const { title, style, onPress } = props;
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? darkTheme.input : lightTheme.input;
  const textStyle = {
    color: colorScheme === 'dark' ? darkTheme.text : lightTheme.text,
    fontSize: 16,
  };

  const getStyle = (isPressed: Boolean) => {
    if (isPressed) {
      return [styles.button, styles.buttonPressed, { backgroundColor }, style];
    }
    return [styles.button, { backgroundColor }, style];
  };

  return (
    <Pressable
      style={({ pressed }) => getStyle(pressed)}
      onPress={onPress}
    >
      <Text style={[styles.buttonLabel, textStyle]}>
        {title}
      </Text>
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
  const colorScheme = useColorScheme();
  const darkStyle = colorScheme === 'dark' ? styles.modalViewDark : null;

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
        <View style={[styles.modalView, darkStyle]}>
          <DateTimePicker
            mode="date"
            value={date}
            is24Hour
            display="spinner"
            onChange={onChange}
            style={{ width: '100%' }}
            textColor={colorScheme === 'dark' ? darkTheme.text : lightTheme.text}
          />
          <View style={{ width: '100%', padding: 10 }}>
            <MyAppButton title="Confirm" onPress={() => onClose(date)} />
            <MyAppButton secondary title="Cancel" onPress={() => onClose()} style={{ marginTop: 10 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
