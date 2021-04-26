import { useState } from 'react';
import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react';

const deleteEvent = async (id, token) => {
  const query = `
    mutation {
      deleteEvent(id: "${id}")
    }`;
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, token })
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const result = await response.json();
    return result.data.deleteEvent;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export default function DeleteEventButton({ id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const mupp = await deleteEvent(id, '71310a97-6261-406f-b6bf-574f091bd31e');
      console.log(`deleted: ${mupp}`);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    setOpen(false);
  }
  const cancel = () => {
    setOpen(false);
  }

  const show = () => {
    setOpen(true);
  }

  return (
    <>
      <Button className='ui icon button' onClick={show}><i aria-hidden='true' className='trash icon'></i></Button>
      <Modal
        className='modal-darkmode'
        dimmer='blurring'
        open={open}
        onClose={cancel}
      >
        {loading &&
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
