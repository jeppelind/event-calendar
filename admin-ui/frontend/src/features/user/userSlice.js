import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {};

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

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    userSignedOut() {
      return {};
    }
  },
  extraReducers: builder => {
    builder.addCase(signInUser.fulfilled, (state, action) => action.payload);
  }
});

export default userSlice.reducer;

export const { userSignedOut } = userSlice.actions;

export const selectUser = (state) => state.user;
export const selectUserToken = (state) => state.user.token;
