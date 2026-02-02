import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './components/Home.jsx'
import Employees from './components/Employees.jsx'
import Attendance from './components/Attendance.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '', element: <Home />
      },
      {
        path: 'employees', element: <Employees />
      },
      {
        path: 'attendance', element: <Attendance />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
