import React, { useState } from 'react'
import useSWR from 'swr'

interface Student {
  id: number
  firstName: string
  lastName: string
}

// interface Student {
//   id: number
//   title: string
//   body: string
// }

const fetcher = (url: string) =>
  fetch(`http://localhost:4000/${url}`).then((r) => r.json())

function Listfromdb() {
  const { data, mutate } = useSWR<Student[]>('api/todos', fetcher)

  function onClick() {
    console.log(data)
    console.log(typeof data)
  }

  return (
    <div>
      <button onClick={onClick}>FetchAPI</button>
      <ul>
        {data?.map((item) => {
          return (
            <li key={item.id}>
              {item.id} : {item.firstName}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Listfromdb
