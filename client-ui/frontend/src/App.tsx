import React from 'react';
import './App.css';
import { EventList } from './EventList';
import { AppState } from './types';

class App extends React.Component<{}, AppState> {
  state = { events: []}

  async componentDidMount() {
    const events = await this.fetchEvents();
    this.setState({ events });
  }

  async fetchEvents() {
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
    try {
      const response = await fetch('http://localhost:8090/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const result = await response.json();
      return result.data.getUpcomingEvents;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header"> */}
          <EventList events={this.state.events} />
        {/* </header> */}
      </div>
    );
  }
}

export default App;
