import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.startDate.localeCompare(b.startDate)
});

const initialState = eventsAdapter.getInitialState({
  status: 'idle'
});

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (userToken) => {
  const query = `
    {
      getUpcomingEvents {
        id
        name
        description
        startDate
        endDate
      }
    }`;
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, token: userToken })
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result.data.getUpcomingEvents;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (inputData) => {
  const { eventId, userToken } = inputData;
  const query = `
    mutation {
      deleteEvent(id: "${eventId}")
    }`;
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, token: userToken })
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result.data.deleteEvent;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEvents.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.status = 'completed';
      eventsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchEvents.rejected, (state) => {
      state.status = 'rejected';
    });
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      eventsAdapter.removeOne(state, action.payload);
    })
  }
});

export default eventsSlice.reducer;

export const {
  selectIds: selectEventIds,
  selectById: selectEventById
} = eventsAdapter.getSelectors(state => state.events);

export const selectEventsStatus = (state) => state.events.status;
