import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button 
      className='px-5 py-2 text-sm font-semibold tracking-wider uppercase rounded-lg tea-ripple transition-material w-full md:w-auto text-center'
      onClick={logoutHandler}
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-ivory)',
        background: 'transparent',
        border: '2px solid var(--color-umber)',
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = 'var(--color-taupe)'
        e.target.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = 'var(--color-umber)'
        e.target.style.transform = 'translateY(0)'
      }}
    >Logout</button>
  )
}

export default LogoutBn