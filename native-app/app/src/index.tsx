import 'react-native-gesture-handler';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

registerRootComponent(() => (
  <Provider store={store}>
    <App />
  </Provider>
));
