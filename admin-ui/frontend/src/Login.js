import './Login.css';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Form, Grid, Message } from 'semantic-ui-react';
import { useAuth } from './utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [error, setError] = useState('');
  const auth = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await auth.login(email, password);
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsInputValid(email.length > 0 && password.length > 5);
    return () => {};
  }, [email, password]);

  if (auth.user.name) {
    return <Redirect to="/" />
  } else {
    return (
      <div className="login">
        <Grid verticalAlign='middle' container doubling centered>
          <Grid.Column mobile={16} tablet={8} computer={5}>
            <Grid.Row>
              <h2>Login</h2>
              <br/>
            </Grid.Row>
            <Grid.Row>
              <Form error={error.length > 0} onSubmit={handleSubmit}>
                <Form.Input label='Email' name='email' value={email} onChange={(evt) => setEmail(evt.target.value)} />
                <Form.Input label='Password' type='password' value={password} onChange={(evt) => setPassword(evt.target.value)} />
                <Message error header='Problem signing in' content={error} />
                <Form.Button disabled={!isInputValid} loading={isLoading} color='purple' fluid>Login</Form.Button>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    )
  }  
}
