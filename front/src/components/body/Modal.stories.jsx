import React from 'react';
import {Modal} from './Modal';
import {Button} from '../buttons/Button';
import {Card} from './Card';
import '../../index.css';

export default {
  title: 'Body/Modal',
  template: Modal,
  argTypes: {},
};

const Template = (args) =>{
  const [openModal, setOpenModal] = React.useState(false);
  const closedButtonRef = React.useRef(null);

  return (<div>
    <Button actionBtn={()=>{
      setOpenModal(!openModal);
    }} >
      Open modal
    </Button>

    <Modal
      openModal={openModal}
      setOpenModal={setOpenModal}
      closedButtonRef={closedButtonRef}
      {...args}
    >
      <Card
        title={'Modal Title'}
        footerProps={['text-right']}
        footer={
          <Button
            typeStyle={'danger'}
            actionBtn={()=>{
              setOpenModal(false);
            }}
          >
            Closed
          </Button>
        }
      >
        <p className="text-sm text-gray-500">
          {/* eslint-disable-next-line max-len */}
          Are you sure you want to deactivate your account? All of your data will be permanently removed.
              This action cannot be undone.
        </p>
      </Card>
    </Modal>
  </div>);
};

export const Default = Template.bind({});
