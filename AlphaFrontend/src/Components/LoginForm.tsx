// src/components/LoginForm.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  onLogin: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleLogin = async () => {
    const data = { username, password }

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        console.log('Login successful!')
        onLogin()
        const NavigateGame = () => navigate('/game', { replace: true })
        setTimeout(NavigateGame, 1000)
      } else {
        console.error('Login failed.')
      }
    } catch (error) {
      console.error('An error occurred during login:', error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginForm
