import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import eventsReducer from '../features/events/eventsSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
