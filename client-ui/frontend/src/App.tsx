import React from 'react';
import './App.css';
import { EventList } from './EventList';
import { Header } from './Header';

const App = () => {
  return (
    <div className="App">
      <Header />
      <EventList />
    </div>
  );
}

export default App;
