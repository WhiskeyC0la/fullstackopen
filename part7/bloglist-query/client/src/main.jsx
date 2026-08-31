import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './NotificationContextProvider'
import { UserContextProvider } from './UserContextProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <Router>
          <App />
        </Router>
      </NotificationContextProvider>
    </QueryClientProvider>
  </UserContextProvider>



)