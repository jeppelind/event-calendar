import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.startDate.localeCompare(b.startDate)
});

const initialState = eventsAdapter.getInitialState({
  status: 'idle'
});

const fetchGraphQL = async (query) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result;
}

const escapeString = (string) => {
  return string.replace(/"/g, '\\"');
}

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
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
  const result = await fetchGraphQL(query);
  return result.data.getUpcomingEvents;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (inputData) => {
  const { eventId } = inputData;
  const query = `
    mutation {
      deleteEvent(id: "${eventId}")
    }`;
  const result = await fetchGraphQL(query);
  return result.data.deleteEvent;
});

export const addEvent = createAsyncThunk('events/addEvent', async (inputData) => {
  const { title, description, startDate, endDate } = inputData;
  const endDateData = endDate !== '' ? endDate : startDate;
  const query = `
    mutation {
      createEvent(input: {name: "${escapeString(title)}", description: "${escapeString(description)}", startDate: "${startDate}", endDate: "${endDateData}"}) {
        id
        name
        description
        startDate
        endDate
      }
    }`;
  const result = await fetchGraphQL(query);
  return result.data.createEvent;
});

export const updateEvent = createAsyncThunk('events/updateEvent', async (inputData) => {
  const { eventId, title, description, startDate, endDate } = inputData;
  const query = `
    mutation {
      updateEvent(id: "${eventId}", input: {name: "${escapeString(title)}", description: "${escapeString(description)}", startDate: "${startDate}", endDate: "${endDate}"}) {
        id
        name
        description
        startDate
        endDate
      }
    }`;
  const result = await fetchGraphQL(query);
  return result.data.updateEvent;
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
    builder.addCase(deleteEvent.fulfilled, eventsAdapter.removeOne);
    builder.addCase(addEvent.fulfilled, eventsAdapter.upsertOne);
    builder.addCase(updateEvent.fulfilled, eventsAdapter.upsertOne);
  }
});

export default eventsSlice.reducer;

export const {
  selectIds: selectEventIds,
  selectById: selectEventById
} = eventsAdapter.getSelectors(state => state.events);

export const selectEventsStatus = (state) => state.events.status;
