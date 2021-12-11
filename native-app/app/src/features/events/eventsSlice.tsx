import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

const eventsAdapter = createEntityAdapter();

const initialState = eventsAdapter.getInitialState({
  loading: false,
});

const fetchGraphQL = async (query: string) => {
  const response = await fetch('http://192.168.10.179:9895/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  },
});

export default eventsSlice.reducer;

export const {
  selectIds: selectEventIds,
  selectById: selectEventById,
  selectTotal: selectEventsTotal,
} = eventsAdapter.getSelectors((state: RootStateOrAny) => state.events);

export const selectEventsLoading = (state: RootStateOrAny) => state.events.loading;
