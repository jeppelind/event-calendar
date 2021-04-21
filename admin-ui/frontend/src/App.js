import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Login from './Login';
import { ProvideAuth, useAuth } from './utils/auth';

export default function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <Header></Header>
        <LoginButton></LoginButton>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <ProtectedRoute path="/">
              <Home />
            </ProtectedRoute>
          </Switch>
        </Router>
      </div>
    </ProvideAuth>
  );
}

function Header() {
  const auth = useAuth();
  return <h1>User: {auth.user.name}</h1>
}

function LoginButton() {
  const auth = useAuth();
  if (!auth.user.name) {
    return <></>;
  }
  return <button onClick={() => { auth.logout() }}>Log out</button>
}

function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (auth.user.name) {
    return children;
  }
  return <Redirect to="/login" />
}

function Home() {
  return <h2>Home</h2>;
}
