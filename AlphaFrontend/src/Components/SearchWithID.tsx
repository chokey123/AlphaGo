import { ChangeEvent, FormEvent, useState } from 'react'

function SearchWithID() {
  const [id, setID] = useState(0)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setID(e.target.valueAsNumber)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    SearchID(id)
  }

  async function SearchID(id: number) {
    const response = await fetch(`http://localhost:4000/api/todos/${id}`).then(
      (r) => r.json()
    )
    console.log(JSON.stringify(response))
  }

  return (
    <div>
      <h1>Search With ID</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="number" name="id" value={id} onChange={handleChange} />
        </label>

        <button type="submit">Search</button>
      </form>
    </div>
  )
}

export default SearchWithID
