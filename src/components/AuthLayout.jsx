import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


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


  return loader ? <h1>Loading...</h1> : <>{children}</>
}

