import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { RootStateOrAny } from 'react-redux';

const initialState = {
  loading: false,
  user: {},
};

export type UserDataProps = {
  email: string,
  name: string,
  token: string,
  role: number,
}

export const saveUserData = createAsyncThunk<void, UserDataProps>('user/saveUserData', async (user) => {
  await setItemAsync('user', JSON.stringify(user));
});

export const loadUserData = createAsyncThunk<{}>('user/loadUserData', async () => {
  const userData = await getItemAsync('user');
  if (userData) {
    return JSON.parse(userData);
  }
  return {};
});

export const deleteUserData = createAsyncThunk('user/deleteUserData', async () => {
  await deleteItemAsync('user');
});

type signInUserParams = {
  email: string,
  password: string,
}

export const signInUser = createAsyncThunk<{}, signInUserParams>('user/signInUser', async (userInput) => {
  const response = await fetch('http://192.168.10.179:9895/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInput),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
  const result = await response.json();
  return result;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signInUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(deleteUserData.fulfilled, (state) => {
      state.user = {};
    });
  },
});

export default userSlice.reducer;

export const selectUserLoading = (state: RootStateOrAny) => state.user.loading;
export const selectUser = (state: RootStateOrAny) => state.user.user;
