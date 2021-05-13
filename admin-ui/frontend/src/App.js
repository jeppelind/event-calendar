import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './features/user/Login';
import Header from './Header';
import { EventList } from './features/events/EventList';
import { selectUser } from './features/user/userSlice';
import { AddUserPage } from './features/user/AddUserForm';

export default function App() {
  return (
      <div className="App">

        <Router>
          <Header />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <ProtectedRoute path="/addUser">
              <AddUserPage />
            </ProtectedRoute>
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
