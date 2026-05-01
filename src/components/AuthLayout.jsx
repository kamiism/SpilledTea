import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        // authentication={true} means this route requires login
        // authentication={false} means this route is for unauthenticated users
        if (authentication === true && authStatus === false) {
            // Page requires auth but user not logged in - redirect to login
            navigate("/login")
        } else if (authentication === false && authStatus === true) {
            // Page is for non-auth users but user is logged in - redirect home
            navigate("/")
        } else {
            // No redirect needed, allow access
            setLoader(false)
        }
    }, [authStatus, navigate, authentication])


  return loader ? (
    <div className='flex flex-col items-center justify-center py-20 gap-4'>
      <div className='loading-logo'>
        <Logo width='60px' />
      </div>
      <div className='flex gap-2'>
        <div className='skeleton' style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '0ms' }}></div>
        <div className='skeleton' style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '200ms' }}></div>
        <div className='skeleton' style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '400ms' }}></div>
      </div>
    </div>
  ) : <>{children}</>
}
