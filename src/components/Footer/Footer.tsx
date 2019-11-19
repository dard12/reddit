import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.footerLabel}>Account</div>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
      <div>
        <div className={styles.footerLabel}>Legal</div>
        <div>
          <Link to="/legal/privacy-policy">Privacy Policy</Link>
        </div>
        <div>
          <Link to="/legal/terms-of-use">Terms of Service</Link>
        </div>
        <div>
          <Link to="/legal/user-guidelines">User Guidelines</Link>
        </div>
      </div>
      <div>
        <div className={styles.footerLabel}>Contact</div>
        <a
          href="mailto:team@coverstory.page"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email us
        </a>
      </div>
    </div>
  );
}
