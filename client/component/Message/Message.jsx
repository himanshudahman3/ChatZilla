import React from 'react';
import './Message.css';

export default function Message({ user, message, classs }) {
  return (
    <div className={`messageBox ${classs}`}>
      {`${user}: ${message}`}
    </div>
  );
}