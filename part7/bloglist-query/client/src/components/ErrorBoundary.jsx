import React from 'react'
import { Typography } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if(this.state.hasError) {
      return (
        <Typography variant='h5' sx={{ mt: 3 }}>
          Something went wrong...
        </Typography>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary