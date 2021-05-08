import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Header from './Header';
import { EventList } from './EventList';
import { useSelector } from 'react-redux';
import { selectUser } from './features/user/userSlice';

export default function App() {
  return (
      <div className="App">
        <Header></Header>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <ProtectedRoute path="/">
              <EventList />
            </ProtectedRoute>
          </Switch>
        </Router>
      </div>
  );
}

function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);
  if (Object.keys(user).length > 0) {
    return children;
  }
  return <Redirect to="/login" />
}
