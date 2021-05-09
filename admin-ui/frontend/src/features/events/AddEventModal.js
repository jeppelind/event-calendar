import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Button, Form, Modal } from "semantic-ui-react";
import { selectUserToken } from "../user/userSlice";
import { addEvent } from "./eventsSlice";

export const AddEventModal = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const userToken = useSelector(selectUserToken);

  const show = () => setIsOpen(true);
  const close = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsLoading(false);
    setIsOpen(false);
  }

  const onTitleChanged = (evt) => setTitle(evt.target.value);
  const onDescriptionChanged = (evt) => setDescription(evt.target.value);
  const onStartDateChanged = (evt) => setStartDate(evt.target.value);
  const onEndDateChanged = (evt) => setEndDate(evt.target.value);

  const onSubmit = async (evt) => {
    try {
      setIsLoading(true);
      const res = await dispatch(addEvent({ title, description, startDate, endDate, userToken }))
      unwrapResult(res);
      close();
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsInputValid(title.length > 0 && startDate.length > 0);
  }, [title, startDate]);

  return (
    <>
      <Button color='purple' onClick={show}>New event</Button>
      <Modal size='small' className='modal-darkmode' dimmer='blurring' open={isOpen} onClose={close}>
        <Modal.Header>
          Add new event
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              required
              label='Title'
              placeholder='Event title'
              value={title}
              onChange={onTitleChanged}
            />
            <Form.TextArea
              label='Description'
              placeholder='Optional description'
              value={description}
              onChange={onDescriptionChanged}
            />
            <Form.Group widths='equal'>
              <Form.Input required fluid type='date' label='Start date' onChange={onStartDateChanged} />
              <Form.Input fluid type='date' label='End date' onChange={onEndDateChanged} />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions className='modal-darkmode'>
          <Button onClick={close}>Cancel</Button>
          <Button disabled={!isInputValid} loading={isLoading} color='purple' onClick={onSubmit}>Submit</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}
