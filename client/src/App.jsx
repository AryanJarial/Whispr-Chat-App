import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import bgAry3 from './assets/bgAry3.jpg';
import {Toaster} from 'react-hot-toast';

const App = () => {
  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgAry3})` }}> 
        <Toaster/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
        </Routes> 
    </div>
  )
}

export default App
