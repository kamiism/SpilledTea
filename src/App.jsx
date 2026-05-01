import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import authService from './appwrite/auth';
import { Footer, Header, Logo } from './components';
import { login, logout } from "./store/authSlice";

function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(JSON.parse(JSON.stringify(userData))))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  },[])

  return loading ? (
    <div className='min-h-screen bg-[var(--color-eva-black)] flex flex-col items-center justify-center gap-4'>
      <div className='text-[var(--color-eva-orange)] font-bold tracking-widest uppercase' style={{ fontFamily: 'var(--font-heading)'}}>SYSTEM INITIALIZING</div>
      <div className='w-48 h-1 bg-[var(--color-eva-navy)] overflow-hidden'>
        <div className='h-full bg-[var(--color-eva-green)] animate-[shimmer_1.5s_infinite] w-full origin-left'></div>
      </div>
    </div>
  ) : (
    <div className='app-shell relative'>
      <Header />
      <main className="transition-all duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
