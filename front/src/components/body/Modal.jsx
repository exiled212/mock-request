import React from 'react';
import {Dialog, Transition} from '@headlessui/react';
import PropTypes from 'prop-types';

export const Modal = ({openModal, setOpenModal, closedButtonRef, ...props}) => {
  const {children} = props;

  return (
    <React.Fragment>
      <Transition.Root show={openModal} as={React.Fragment}>
        {/* eslint-disable-next-line max-len */}
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={closedButtonRef} onClose={setOpenModal}>
          {/* eslint-disable-next-line max-len */}
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* eslint-disable-next-line max-len */}
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* eslint-disable-next-line max-len */}
            {/* This element is to trick the browser into centering the modal contents. */}
            {/* eslint-disable-next-line max-len */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* eslint-disable-next-line max-len */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

Modal.propTypes = {
  children: PropTypes.any.isRequired,
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.any.isRequired,
  closedButtonRef: PropTypes.any.isRequired,
};
