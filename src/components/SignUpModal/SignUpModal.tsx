import React from 'react';
import SignUp from '../SignUp/SignUp';
import Modal from '../Modal/Modal';
import styles from './SignUpModal.module.scss';

interface SignUpModalProps {
  prompt: string;
  buttonChildren: any;
}

export default function SignUpModal(props: SignUpModalProps) {
  const { buttonChildren, prompt } = props;

  return (
    <Modal
      buttonChildren={buttonChildren}
      render={closeModal => (
        <div className={styles.signUpModal}>
          {prompt} <SignUp onClick={closeModal} />.
        </div>
      )}
    />
  );
}
