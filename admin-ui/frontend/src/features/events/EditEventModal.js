import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Button, Form, Modal } from "semantic-ui-react";
import { selectEventById, updateEvent } from "./eventsSlice";

export const EditEventModal = ({ eventId }) => {
  const dispatch = useDispatch();
  const event = useSelector(state => selectEventById(state, eventId));

  const [title, setTitle] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);

  const show = () => setIsOpen(true);
  const close = () => {
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
      const res = await dispatch(updateEvent({ eventId, title, description, startDate, endDate }))
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
      <Button color='purple' size='tiny' onClick={show}>Edit</Button>
      <Modal size='small' className='modal-darkmode' dimmer='blurring' open={isOpen} onClose={close}>
        <Modal.Header>
          Edit event
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
              <Form.Input
                required
                fluid
                type='date'
                label='Start date'
                value={startDate}
                onChange={onStartDateChanged}
              />
              <Form.Input
                fluid
                type='date'
                label='End date'
                value={endDate}
                onChange={onEndDateChanged}
              />
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
