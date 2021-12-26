import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.startDate.localeCompare(b.startDate),
});

const initialState = eventsAdapter.getInitialState({
  loading: false,
});

const escapeString = (string: string) => string.replace(/"/g, '\\"');

const fetchGraphQL = async (query: string, token?: string) => {
  let headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers = { ...headers, ...{ Authorization: `Bearer ${token}` } };
  }

  const response = await fetch('http://192.168.0.58:9895/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result;
};

type fetchEventParams = {
  startIndex: number,
  endIndex: number,
}

export const fetchEvents = createAsyncThunk<[], fetchEventParams>('events/fetchEvents', async (inputData) => {
  const { startIndex, endIndex } = inputData;
  const query = `
    {
      getUpcomingEvents(startIndex: ${startIndex}, endIndex: ${endIndex}) {
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

type deleteEventParams = {
  id: string,
  token: string,
}

export const deleteEvent = createAsyncThunk<string, deleteEventParams>('events/deleteEvent', async (inputData) => {
  const { id, token } = inputData;
  const query = `
    mutation {
      deleteEvent(id: "${id}")
    }
  `;
  const result = await fetchGraphQL(query, token);
  return result.data.deleteEvent;
});

type addEventParams = {
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  token: string
}

export const addEvent = createAsyncThunk<void, addEventParams>('events/addEvent', async (inputData) => {
  const {
    title, description, startDate, endDate, token,
  } = inputData;
  const query = `
    mutation {
      createEvent(input: {name: "${escapeString(title)}", description: "${escapeString(description)}", startDate: "${startDate}", endDate: "${endDate}"}) {
        id
        name
        description
        startDate
        endDate
      }
    }`;
  const result = await fetchGraphQL(query, token);
  return result.data.createEvent;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      eventsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchEvents.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteEvent.fulfilled, eventsAdapter.removeOne);
    builder.addCase(addEvent.fulfilled, eventsAdapter.upsertOne);
  },
});

export default eventsSlice.reducer;

export const {
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state: RootStateOrAny) => state.events);

export const selectEventsLoading = (state: RootStateOrAny) => state.events.loading;
