import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  email: null,
  role: null,
};

export const signInUser = createAsyncThunk('user/signInUser', async (userInput) => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInput)
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
  const result = await response.json();
  return result
});

export const signOutUser = createAsyncThunk('user/signOutUser', async () => {
  const response = await fetch('/logout');
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
});

export const getUserSession = createAsyncThunk('user/getUserSession', async () => {
  const response = await fetch('/user/get');
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
  const result = await response.json();
  return result
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(signInUser.fulfilled, (state, action) =>  action.payload);
    builder.addCase(getUserSession.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    });
    builder.addCase(getUserSession.rejected, (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
    });
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
    });
  }
});

export default userSlice.reducer;

export const selectUser = (state) => state.user;
