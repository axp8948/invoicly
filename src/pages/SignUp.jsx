import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    // Client-side validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    setIsLoading(true)
    try {
      // createAccount expects { email, password, name }
      await authService.createAccount({ email, password})
      navigate('/login')
    } catch (error) {
      console.error('Sign Up Error:', error)
      // Appwrite uses 409 for "user already exists"
      if (error.code === 409) {
        setErrorMessage('An account with this email already exists.')
      } else {
        setErrorMessage('Failed to sign up. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">
          Sign Up for <span className="text-lime-300">Invoicly</span>
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {errorMessage && (
          <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-white font-semibold rounded-md transition-all ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-lime-400 hover:bg-lime-300'
          }`}
        >
          {isLoading ? 'Signing Up…' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-white/80">
          Already have an account?{' '}
          <button
            type="button"
            className="text-lime-300 hover:underline"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  )
}
