import type { NotificationProps } from '../types';

const errorStyle = {
  border: '1px solid red',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '15px',
  color: 'red',
  whiteSpace: 'pre-line'
};

const successStyle = {
  border: '1px solid green',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '15px',
  color: 'green',
  whiteSpace: 'pre-line'
};

const Notification = ({ message, type }: NotificationProps) => {
  if (message === null) {
    return null;
  }


  return (
    <div style={type === 'error' ? errorStyle : successStyle}>
      {message}
    </div>
  );
};

export default Notification;