import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  eventList: {
    // width: '100%',
    // backgroundColor: '#095b91',
  },
  eventItem: {
    // flex: 1,
    // flexDirection: 'row',
    backgroundColor: '#ecf0f1',
  },
  event: {
    // flex: 1,
    marginVertical: 2,
    padding: 15,
  },
  label: {
    fontSize: 16,
  },
  dateParent: {
    flexDirection: 'row',
  },
  date: {
    fontFamily: 'Poppins_700Bold',
    opacity: 0.7,
  },
  year: {
    fontFamily: 'Poppins_700Bold',
    opacity: 0.5,
  },
  description: {
    opacity: 0.5,
  },
  footer: {
    minHeight: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInteraction: {
    padding: 20,
    // backgroundColor: 'hotpink',
  },
});
