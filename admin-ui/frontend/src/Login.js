import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

const Login = () => {
  const auth = useAuth();

  const handleLogin = async () => {
    const res = await auth.login('', '');
    console.log(res);
  }

  if (auth.user) {
    return <Redirect to="/" />
  }
  
  return (
    <>
      <h2>Login</h2>
      <button onClick={() => handleLogin()}>Sign In</button>
    </>
  )
}

export default Login;