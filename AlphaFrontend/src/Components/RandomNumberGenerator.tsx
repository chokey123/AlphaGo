import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import jwt_decode from 'jwt-decode'

interface TokenPayload {
  credit: number
  exp: number
  game_session_id: string
  user_id: string
}

interface EndData {
  credit: number
  game_session_id: string
  user_id: string
}

let TokenString: string = ''

const RandomNumberGenerator: React.FC = () => {
  const [user, setUser] = useState('')
  const [number, setNumber] = useState<number>(50)
  const [endData, setEndData] = useState<EndData>({
    credit: 0,
    game_session_id: '',
    user_id: '',
  })

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:4000/game')
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok')
  //       }
  //       const data = await response.json()
  //       setUser(data.username)
  //     } catch (error) {
  //       console.error('Error fetching username:', error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/game')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setUser(data.username)
    } catch (error) {
      console.error('Error fetching username:', error)
    }
  }

  async function fetchToken(): Promise<string | null> {
    try {
      const response: AxiosResponse = await axios.get(
        'http://localhost:4000/start_game'
      )

      // Assuming the token is in the response data
      const token: string | null = response.data.token
      TokenString = token?.toString() as string
      console.log(token)
      return token
    } catch (error) {
      console.error('Error fetching token:', error)
      return null
    }
  }

  const fetchStartGame = async () => {
    const token = await fetchToken()

    if (token) {
      try {
        const decodedToken: TokenPayload = jwt_decode(token) as TokenPayload
        const { credit, user_id, game_session_id } = decodedToken

        setNumber(credit)

        //console.log(user_id)
        //console.log(game_session_id)

        setEndData((prevData) => ({
          ...prevData,
          user_id: user_id,
          game_session_id: game_session_id,
        }))

        console.log(endData.game_session_id)
        console.log(endData.user_id)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    } else {
      console.log('Failed to fetch token.')
    }
  }

  const generateRandomNumber = (currentNum: number) => {
    const randomNum = Math.floor(Math.random() * 100) // Change this to set the range of the random number
    let result: number
    if (randomNum < 50) {
      result = currentNum * 2
    } else {
      result = currentNum * 0.5
    }
    setNumber(result)
    setEndData({ ...endData, credit: result })
  }

  async function sendTokenForCreditUpdate(token: string) {
    // Simulate a request to your server to update user credits
    console.log(token)

    const response = await fetch('http://localhost:4000/end_game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      // Include win information or any other necessary data in the request body
      body: JSON.stringify(endData),
    })

    if (response.ok) {
      console.log('User credits updated successfully')
    } else {
      console.error('Failed to update user credits')
    }
  }

  return (
    <div>
      <p>{user}</p>
      <br />
      <br />
      <br />
      <p>Random Number: {number}</p>
      <button onClick={() => generateRandomNumber(number)}>
        Generate Random Number
      </button>
      <br />
      <br />
      <button onClick={fetchData}>Start Game</button>
      <br />
      <br />
      <button onClick={() => sendTokenForCreditUpdate(TokenString)}>
        End Game
      </button>
    </div>
  )
}

export default RandomNumberGenerator
