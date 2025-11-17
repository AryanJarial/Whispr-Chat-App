import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import bgAry3 from './assets/bgAry3.jpg';
import {Toaster} from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx'

const App = () => {

  const {authUser} = useContext(AuthContext);

  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgAry3})` }}> 
        <Toaster/>
        <Routes>
          <Route path='/' element={authUser ? <HomePage/>: <Navigate to='/login'/>}/>
          <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
          <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
        </Routes> 
    </div>
  )
}

export default App
