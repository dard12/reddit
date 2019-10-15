import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

interface ModalProps {
  buttonClassName?: string;
  buttonChildren: any;
  render: (closeModal: Function) => any;
}

ReactModal.setAppElement('#root');

export default function Modal(props: ModalProps) {
  const { buttonClassName, buttonChildren, render } = props;
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const body = document.querySelector('body');

  if (body) {
    isOpen
      ? body.classList.add(styles.modalOpen)
      : body.classList.remove(styles.modalOpen);
  }

  return (
    <React.Fragment>
      <div className={buttonClassName} onClick={openModal}>
        {buttonChildren}
      </div>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        {render(closeModal)}
      </ReactModal>
    </React.Fragment>
  );
}
