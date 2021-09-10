import React, { useState } from 'react';
import { Button, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import './Header.less';

export const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <>
      <div className="top-header">
        <div className='header-logo'>
          <h3>Evenemangskalendern</h3>
        </div>
        <Menu secondary className='top-menu'>
          <Menu.Item id='mobile-menu-trigger'>
            <Button icon='bars' circular onClick={() => setIsMenuVisible(!isMenuVisible)} />
          </Menu.Item>
          <Menu.Menu position='right' id='desktop-menu'>
            <Menu.Item link href='https://admin.evenemangskalendern.com'>
              Login
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
      <Sidebar.Pushable as={Segment} id='mobile-menu'>
        <Sidebar
          as={Menu}
          animation='overlay'
          direction='left'
          vertical
          visible={isMenuVisible}
          inverted
          width='thin'
        >
          <Menu.Item>
            <Button icon='close' inverted circular onClick={() => setIsMenuVisible(false)} />
          </Menu.Item>
          <Menu.Item link href='https://admin.evenemangskalendern.com'>
            <Icon name='sign-in' size='huge' />
            Login
          </Menu.Item>
        </Sidebar>
      </Sidebar.Pushable>
    </>
  );
}
