import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import AppProvider from './context/AppProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App/>
    </AppProvider>
    <Toaster position="bottom-right" reverseOrder={true} />
  </React.StrictMode>
)
