import { useNotification, useNotificationType } from '../NotificationStore'

export const Notification = () => {
  const notification = useNotification()
  const type = useNotificationType()

  const successStyle = {
    border: 'solid',
    borderColor: 'green',
    color: 'green',
    backgroundColor: '#e6ffe6',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  }

  const errorStyle = {
    border: 'solid',
    borderColor: 'red',
    color: 'red',
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  }
  if (!notification) return null
  return (
    <div style={type === 'success' ? successStyle : errorStyle}>
      {notification}
    </div>
  )
}