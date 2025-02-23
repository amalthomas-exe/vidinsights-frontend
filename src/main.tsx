import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import Home from './pages/Home.tsx'
import Result from './pages/Result.tsx'
import FlashcardPage from './pages/FlashcardPage.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar.tsx'
import Dashboard from './pages/Dashboard.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Navbar />
      <Home />
    </>
  },
  {
    path: '/:id', element: <>
      <Navbar />
      <Result />
    </>
  },
  {
    path:'/dashboard', element: <>
      <Navbar />
      <Dashboard />
    </>
  },
  {
    path: '/flashcards/:id', element: <>
      <Navbar />
      <FlashcardPage />
    </>
  }
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    </GoogleOAuthProvider>
  </Provider>
)
