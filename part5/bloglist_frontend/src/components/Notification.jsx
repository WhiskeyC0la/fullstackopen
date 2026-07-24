import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if(message === null) {
    return null
  }


  return (
    <Alert sx={{ mt: 1, mb: 1 }}
      severity={type}>{message}
    </Alert>
  )
}

export default Notification