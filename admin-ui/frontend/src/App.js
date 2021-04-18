import './App.css';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';
import Login from './Login';
import { ProvideAuth, useAuth } from './utils/auth';

export default function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <Header></Header>
        <LoginButton></LoginButton>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
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
  return <h1>User: {auth.user}</h1>
}

function LoginButton() {
  const auth = useAuth();
  return <button onClick={() => {auth.user ? auth.logout() : auth.login('', '') }}>{auth.user ? <>{auth.user}</> : 'Sign In' }</button>
}

function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (auth.user) {
    return children;
  }
  return <Redirect to="/login" />
}

function Home() {
  return <h2>Home</h2>;
}
