import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import './App.css';
import authService from './appwrite/auth';
import { Footer, Header, Logo } from './components';
import { login, logout } from "./store/authSlice";

function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        // Convert Appwrite object to plain serializable object
        dispatch(login(JSON.parse(JSON.stringify(userData))))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  },[])

  return loading ? (
    <div className='loading-screen'>
      <div className='loading-logo'>
        <Logo width='80px' />
      </div>
      <div className='loading-bar'>
        <div className='loading-bar-inner'></div>
      </div>
    </div>
  ) : (
    <div className='app-shell'>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
