import { useState } from "react"
import { Button, Container, Form, Message } from "semantic-ui-react"

const postNewUserData = async (name, email, password, role) => {
  const response = await fetch('/user/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}

export const AddUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [role, setRole] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const roles = [
    { key: 0, text: 'READ', value: 0 },
    { key: 1, text: 'WRITE', value: 1 },
    { key: 2, text: 'FULL', value: 2 },
  ]

  const onNameChanged = (evt) => setName(evt.target.value);
  const onEmailChanged = (evt) => setEmail(evt.target.value);
  const onPasswordChanged = (evt) => setPassword(evt.target.value);
  const onPasswordRepeatChanged = (evt) => setPasswordRepeat(evt.target.value);
  const onRoleChanged = (evt) => {
    const selectedRole = roles.findIndex(role => role.text === evt.target.textContent);
    setRole(selectedRole);
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setSuccess(false);
      setError('');
      await postNewUserData(name, email, password, role);
      setName('');
      setEmail('');
      setPassword('');
      setPasswordRepeat('');
      setRole(0);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container text>
      <h2>Add new user</h2>
      <Form error={error.length > 0} success={success}>
        <Message error header='Error' content={error} />
        <Message success header='User created' content='User created successfully.' />
        <Form.Group widths='equal'>
          <Form.Input
            label='Name'
            placeholder='Username'
            value={name}
            onChange={onNameChanged}
          />
          <Form.Input
            label='Email'
            placeholder='Email'
            value={email}
            onChange={onEmailChanged}
          />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input
            type='password'
            label='Password'
            value={password}
            onChange={onPasswordChanged}
          />
          <Form.Input
            type='password'
            label='Repeat password'
            value={passwordRepeat}
            onChange={onPasswordRepeatChanged}
          />
        </Form.Group>
        <Form.Select
          width={1}
          label='Role'
          options={roles}
          value={role}
          onChange={onRoleChanged}
        />
        <Button primary loading={isLoading} floated='right' onClick={onSubmit}>Submit</Button>
      </Form>
    </Container>
  )
}
