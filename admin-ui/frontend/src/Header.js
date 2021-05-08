import React from 'react';
import './Header.css';
import { Dropdown, Grid } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { userSignedOut, selectUser } from './features/user/userSlice';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const logout = () => {
    dispatch(userSignedOut());
  }

  const dropdownTrigger = (
    <span>
      {user.name}
    </span>
  )

  return (
    <div className='top-header'>
      <Grid stackable>
          <Grid.Column only='computer' width={3}></Grid.Column>
          <Grid.Column textAlign='center' width={10}>
            <h3>Evenemangskalendern <b>Admin</b></h3>
          </Grid.Column>
          <Grid.Column textAlign='right' floated='right' width={3}>
            {user.name &&
              <Dropdown inline className='right-info' trigger={dropdownTrigger}>
                <Dropdown.Menu>
                  <Dropdown.Item text='Profile' />
                  <Dropdown.Item text='Logout' onClick={logout} />
                </Dropdown.Menu>
              </Dropdown>
            }
          </Grid.Column>
      </Grid>
    </div>
  );
}