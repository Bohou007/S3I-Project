/* eslint-disable react/self-closing-comp */
import React, { useRef } from 'react';
import { withIdleTimer } from 'react-idle-timer';

export default function IdleTimerContainer() {
  const IdleTimer = withIdleTimer();
  const idleTimeRef = useRef(null);
  const onIdle = () => {
    console.log('Log out');
  };
  return (
    <>
      <IdleTimer ref={idleTimeRef} timeout={5 * 1000} onIdle={onIdle}></IdleTimer>
    </>
  );
}
