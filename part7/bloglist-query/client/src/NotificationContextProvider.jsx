import { useReducer } from 'react'
import { NotificationContext } from './NotificationContext'

const initialState = {
  type: null,
  message: null
}

const notificationReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      type: 'success',
      message: action.message
    }
  }

  if (action.type === 'error') {
    return {
      type: 'error',
      message: action.message
    }
  }

  if (action.type === 'clear') {
    return initialState
  }

  return state
}

export const NotificationContextProvider = ({ children }) => {
  const [ notification, dispatch ] = useReducer(
    notificationReducer,
    initialState
  )
  const showNotification = ( type, message ) => {
    dispatch({
      type,
      message
    })
    setTimeout(() => {
      dispatch({
        type: 'clear'
      })
    }, 5000)
  }
  return (
    <NotificationContext.Provider value={{ notification, showNotification}}>
      {children}
    </NotificationContext.Provider>
  )
}