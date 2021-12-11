import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import eventsReducer from '../features/events/eventsSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
