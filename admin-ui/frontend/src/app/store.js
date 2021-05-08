import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import eventsReducer from '../features/events/eventsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer
  }
});
