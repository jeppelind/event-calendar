import './Login.css';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Divider, Form, Grid, Message } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, signInUser } from './userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector(selectUser);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(signInUser({ email, password }));
      unwrapResult(res);
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsInputValid(email.length > 0 && password.length > 5);
    return () => {};
  }, [email, password]);

  if (user.name) {
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
                <Form.Button primary disabled={!isInputValid} loading={isLoading} fluid>Login</Form.Button>
              </Form>
            </Grid.Row>
            <Grid.Row className='back-link'>
              <Divider></Divider>
              <a href='https://evenemangskalendern.com'>Return to main site</a>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
