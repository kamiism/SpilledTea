import { useState } from 'react'
import { useForm } from "react-hook-form"
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import authService from "../appwrite/auth"
import { login as authLogin } from '../store/authSlice'
import { Button, Input } from "./index"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async(data) => {
        setError("")
        setLoading(true)
        try {
            const session = await authService.login(data)
            if(session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(JSON.parse(JSON.stringify(userData))))
                navigate("/")
            }
        } catch(error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='flex items-center justify-center w-full min-h-[80vh] px-4 py-10 bg-[var(--color-eva-black)]'>
      <div className='mx-auto w-full max-w-md p-8 md:p-12 animate-slide-up bg-[var(--color-eva-panel)] border border-[var(--color-eva-orange)] relative'>
        {/* NERV UI Elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-eva-orange)]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-eva-orange)]"></div>
        <div className="absolute top-2 right-2 text-[var(--color-eva-orange)] font-mono text-[10px] tracking-widest opacity-70">SEC-AUTH</div>

        <div className='mb-8 flex flex-col items-center justify-center'>
            <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-eva-orange)] mb-4">
              <svg viewBox="0 0 24 24" fill="var(--color-eva-black)" className="w-8 h-8">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
              </svg>
            </div>
            <h2 className='text-center text-3xl mb-1 text-[var(--color-eva-orange)] tracking-widest uppercase' style={{ fontFamily: 'var(--font-heading)' }}>
                IDENTIFICATION
            </h2>
            <div className="w-24 h-0.5 bg-[var(--color-eva-orange)] opacity-50 mb-2"></div>
            <p className="text-center font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--color-eva-muted)' }}>
                New pilot?&nbsp;
                <Link to="/signup" className="text-[var(--color-eva-green)] hover:text-[var(--color-eva-white)] transition-colors underline underline-offset-4">
                    Register unit
                </Link>
            </p>
        </div>

        {error && (
          <div className='border border-[var(--color-eva-red)] bg-[rgba(255,32,32,0.1)] p-3 mb-6 font-mono text-xs text-[var(--color-eva-red)] uppercase tracking-widest text-center'>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className='mt-8'>
          <div className='space-y-6'>
            <Input 
              label="PILOT_EMAIL"
              placeholder="user@nerv.gov"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Invalid email sequence",
                }
              })}
            />
            <Input 
              label="ACCESS_CODE"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: true,
              })}
            />
            <Button
              type="submit"
              className="w-full mt-8"
              disabled={loading}
            >
              {loading ? 'VERIFYING...' : 'INITIATE SYNC'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login