import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index.js'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userAccount = await authService.createAccount(data)
            if (userAccount) {
                const user = await authService.getCurrentUser()
                if(user) dispatch(login(JSON.parse(JSON.stringify(user))));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] px-4">
      <div 
        className='mx-auto w-full max-w-md p-8 md:p-10 animate-slide-up glass-surface-heavy brutalist-accent-left elevation-2'
      >
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-[80px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 
          className="text-center text-2xl font-bold leading-tight mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-taupe)' }}
        >
          Create Account
        </h2>
        <p className="mt-1 text-center text-sm" style={{ color: 'var(--color-ivory-muted)' }}>
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold transition-material"
            style={{ color: 'var(--color-taupe)' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-taupe-light)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-taupe)'}
          >
            Sign In
          </Link>
        </p>
        {error && (
          <div className='error-state mt-6'>
            <span style={{ marginRight: '0.5rem' }}>⚠</span>{error}
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className='mt-8'>
          <div className='space-y-6'>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
                }
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,})}
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup