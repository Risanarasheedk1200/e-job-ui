import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import './App.css'

function App() {
  return (
    <div>
   <BrowserRouter basename='/'>
   <AppRoutes/>
   </BrowserRouter>
    </div>
  )
}

export default App