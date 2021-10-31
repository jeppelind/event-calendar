import React, { useEffect, useState } from 'react';
import {
  FlatList, ListRenderItem, StatusBar, StyleSheet, Text, View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 25,
    // justifyContent: 'center',
  },
  header: {
    backgroundColor: 'aliceblue',
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
  eventList: {
    width: '100%',
  },
  event: {
    // backgroundColor: 'lightblue',
    marginVertical: 2,
    padding: 15,
  },
  label: {
    fontSize: 16,
  },
  loading: {
    padding: 20,
  },
});

const fetchEvents = async (startIndex: number, endIndex: number) => {
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
  try {
    const response = await fetch('http://192.168.10.179:9895/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
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
};

type EventProps = {
  id: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
}

const LoadingMoreEvents = () => (
  <View style={styles.loading}>
    <Text>Loading...</Text>
  </View>
);

const EventItem = ({ event }: { event: EventProps }) => {
  const { name, startDate } = event;
  return (
    <View style={styles.event}>
      <Text>{new Date(startDate).toDateString()}</Text>
      <Text style={styles.label}>{name}</Text>
    </View>
  );
};

const App = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const eventsPerFetch = 25;

  useEffect(() => {
    console.log(`CurrentIdx: ${currentIdx}`);
    const fetchData = async () => {
      setIsFetchingData(true);
      const newEvents = await fetchEvents(currentIdx, currentIdx + eventsPerFetch);
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setIsFetchingData(false);
    };
    fetchData();
  }, [currentIdx]);

  const reachedEndOfList = () => {
    console.log('End of list');
    setCurrentIdx((prevValue) => prevValue + eventsPerFetch);
  };

  const renderItem: ListRenderItem<EventProps> = ({ item }) => (
    <EventItem
      event={item}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Evenemang</Text>
      </View>
      <FlatList
        style={styles.eventList}
        data={events}
        renderItem={renderItem}
        onEndReached={reachedEndOfList}
        onEndReachedThreshold={0.5}
      />
      {
        isFetchingData && <LoadingMoreEvents />
      }
    </View>
  );
};

export default App;
