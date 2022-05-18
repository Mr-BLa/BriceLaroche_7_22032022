import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App'
import SignupPage from './signupPage'

import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
    </BrowserRouter>, 
    document.getElementById('root'))


reportWebVitals(console.log)
