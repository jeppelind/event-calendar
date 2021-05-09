import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react';
import { selectUserToken } from '../user/userSlice';
import { deleteEvent } from './eventsSlice';

export default function DeleteEventButton({ id }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userToken = useSelector(selectUserToken);

  const confirm = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteEvent({ eventId: id, userToken }));
      unwrapResult(res);
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
    }
  }

  const cancel = () => {
    setIsOpen(false);
  }

  const show = () => {
    setIsOpen(true);
  }

  return (
    <>
      <Button className='ui icon button' onClick={show}><i aria-hidden='true' className='trash icon'></i></Button>
      <Modal
        size='tiny'
        className='modal-darkmode'
        dimmer='blurring'
        open={isOpen}
        onClose={cancel}
      >
        {isLoading &&
          <Dimmer active>
            <Loader>Deleting...</Loader>
          </Dimmer>
        }
        <Modal.Header>
          Delete Event
        </Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this event?
        </Modal.Content>
        <Modal.Actions className='modal-darkmode'>
          <Button onClick={cancel}>Cancel</Button>
          <Button color='purple' onClick={confirm}>OK</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
