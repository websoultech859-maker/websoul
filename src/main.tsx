import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// @ts-ignore: Allow side-effect CSS import without module declarations
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
