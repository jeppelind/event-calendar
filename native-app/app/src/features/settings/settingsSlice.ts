import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStateOrAny } from 'react-redux';

const initialState = {
  language: 'system',
};

export const changeLanguageSetting = createAction<string>('settings/changeLanguage');
export const saveSettings = createAction('settings/save');

export const loadSettings = createAsyncThunk('settings/load', async () => {
  const settingsJSON = await AsyncStorage.getItem('settings');
  if (settingsJSON) {
    return JSON.parse(settingsJSON);
  }
  return { ...initialState };
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      state.language = action.payload.language;
    });
    builder.addCase(changeLanguageSetting, (state, action) => {
      state.language = action.payload;
    });
    builder.addCase(saveSettings, (state) => {
      AsyncStorage.setItem('settings', JSON.stringify(state));
    });
  },
});

export default settingsSlice.reducer;

export const selectSettingsLanguage = (state: RootStateOrAny) => state.settings.language;
