import React from 'react';
import './Header.css';
import { Container, Dropdown, Icon, Menu, Statistic } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { userSignedOut, selectUser } from './features/user/userSlice';
import { AddEventModal } from './features/events/AddEventModal';
import { selectEventIds } from './features/events/eventsSlice';
import { Link } from 'react-router-dom';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const eventIds = useSelector(selectEventIds);

  const logout = () => {
    dispatch(userSignedOut());
  }

  return (
    <div className='top-header'>
      <div className='header-logo'>
        <h3>Evenemangskalendern <b>Admin</b></h3>
      </div>
      { user.name &&
        <>
          <Menu stackable>
            <Menu.Menu position='right'>
              <Dropdown item text={`Hi, ${user.name}`} button floating>
                <Dropdown.Menu>
                  <Dropdown.Header content={user.name} />
                  <Dropdown.Divider />
                  <Link to='/'>
                    <Dropdown.Item>
                      <Icon name='home' /> Start
                    </Dropdown.Item>
                  </Link>
                  { user.role > 1 &&
                    <Link to='/addUser'>
                      <Dropdown.Item>
                        <Icon name='user plus' /> Add new user
                      </Dropdown.Item>
                    </Link>
                  }
                  <Link to='/' onClick={logout}>
                    <Dropdown.Item>
                      <Icon name='sign-out' /> Logout
                    </Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>

          <Container text className='sub-header'>
            <Statistic horizontal inverted color='purple'>
              <Statistic.Value>{eventIds.length}</Statistic.Value>
              <Statistic.Label>Upcoming events</Statistic.Label>
            </Statistic>
            <AddEventModal />
          </Container>
        </>
      }
    </div>
  );
}
