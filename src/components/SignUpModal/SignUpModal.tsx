import React from 'react';
import SignUp from '../SignUp/SignUp';
import Modal from '../Modal/Modal';
import styles from './SignUpModal.module.scss';

interface SignUpModalProps {
  prompt: string;
  buttonRender: any;
}

export default function SignUpModal(props: SignUpModalProps) {
  const { buttonRender, prompt } = props;

  return (
    <Modal
      buttonRender={buttonRender}
      modalRender={closeModal => (
        <div className={styles.signUpModal}>
          {prompt} <SignUp onClick={closeModal} />.
        </div>
      )}
    />
  );
}
