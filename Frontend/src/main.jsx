import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './components/Home/home.jsx'
import Login from './components/Login/login.jsx'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} />  {/* ✅ 'index' means default route */}
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
