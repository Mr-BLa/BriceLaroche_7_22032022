/*
*           INDEX
*/


import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import '../src/css/index.css'
import '../src/css/accueil.css'
import '../src/css/profil.css'
import '../src/css/newPost.css'
import LoginPage from './LoginPage'
import SignupPage from './signupPage'
import App from './App'
import ProfilPage from './profilPage'
import NewPage from './newPostPage'
import PostModification from './postModifPage'
import PostById from './postById'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/accueil" element={<App />} />
            <Route path="/accueil/profil" element={<ProfilPage />}/>
            <Route path="/accueil/new" element={<NewPage />}/>
            <Route path="/accueil/postmodif" element={<PostModification />}/>
            <Route path="/accueil/:post_id" element={<PostById />} />
        </Routes>
    </BrowserRouter>, 
    document.getElementById('root'))
