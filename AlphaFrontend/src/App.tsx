// import AddForm from './Components/AddForm'
// import Listfromdb from './Components/Listfromdb'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import SearchWithID from './Components/SearchWithID'
// import './App.css'
// import { useState } from 'react'
// import RandomNumberGenerator from './Components/RandomNumberGenerator'
// import LoginForm from './Components/LoginForm'
// import ConditionalRoute from './Components/ConditionalRoute'

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   const handleSuccessfulLogin = () => {
//     setIsLoggedIn(true)
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/login"
//           element={<LoginForm onLogin={handleSuccessfulLogin} />}
//         ></Route>
//         <Route
//           path="/testdb"
//           element={
//             <>
//               <Listfromdb />
//               <SearchWithID />
//               <AddForm />
//             </>
//           }
//         ></Route>
//         <Route
//           path="/game"
//           element={
//             <ConditionalRoute redirectTo="/login" condition={isLoggedIn}>
//               <RandomNumberGenerator />
//             </ConditionalRoute>
//           }
//         ></Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App

import React, { useEffect, useState } from 'react'

const App: React.FC = () => {
  const [storedData, setStoredData] = useState<string | null>(null)

  useEffect(() => {
    // Set a cookie
    setCookie('myCookie', 'cookieValue', 7)

    // Retrieve a cookie
    const cookieValue = getCookie('myCookie')
    console.log('Retrieved cookie value:', cookieValue)
  }, [])

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/`
  }

  const getCookie = (name: string) => {
    const cookieName = `${name}=`
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()
      if (cookie.startsWith(cookieName)) {
        return cookie.substring(cookieName.length)
      }
    }
    return null
  }

  const [message, setMessage] = useState('')

  const setSession = async () => {
    const response = await fetch('http://127.0.0.1:3001/set-session')
    if (response.ok) {
      const result = await response.text()
      setMessage(result)
    }
  }

  const getSession = async () => {
    const response = await fetch('http://127.0.0.1:3001/get-session', {
      method: 'GET',
      credentials: 'include', // Include credentials (cookies)
    })
    const result = await response.text()
    setMessage(result)
  }

  return (
    <div>
      <button onClick={setSession}>Set Session</button>
      <button onClick={getSession}>Get Session</button>
      <div>{message}</div>
    </div>
  )
}

export default App
