import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './features/user/Login';
import Header from './Header';
import { EventList } from './features/events/EventList';
import { getUserSession, selectUser } from './features/user/userSlice';
import { AddUserPage } from './features/user/AddUserForm';
import { useEffect } from 'react';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    // Check if user session has expired. In that case redirect user to login page.
    let timer = null;
    if (user.name) {
      timer = setInterval(() => {
        dispatch(getUserSession());
      }, 60000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [dispatch, user]);

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
  if (user.name) {
    return children;
  }
  return <Redirect to="/login" />
}
