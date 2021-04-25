import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Header from './Header';
import { ProvideAuth, useAuth } from './utils/auth';
import { EventList } from './EventList';

export default function App() {
  return (
    <ProvideAuth>
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
    </ProvideAuth>
  );
}

function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (auth.user.name) {
    return children;
  }
  return <Redirect to="/login" />
}
