import React from 'react';
import './Header.css';
import { useAuth } from './utils/auth';
import { Dropdown, Grid } from 'semantic-ui-react';

export default function Header() {
  const auth = useAuth();

  const dropdownTrigger = (
    <span>
      {auth.user.name}
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
            {auth.user.name &&
              <Dropdown inline className='right-info' trigger={dropdownTrigger}>
                <Dropdown.Menu>
                  <Dropdown.Item text='Profile' />
                  <Dropdown.Item text='Logout' onClick={() => { auth.logout() }} />
                </Dropdown.Menu>
              </Dropdown>
            }
          </Grid.Column>
      </Grid>
    </div>
  );
}
