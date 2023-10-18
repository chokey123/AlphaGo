import React, { useState, ChangeEvent, FormEvent } from 'react'

interface FormData {
  id: number
  firstName: string
  lastName: string
}

function AddForm() {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    firstName: '',
    lastName: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'id' ? parseInt(value) : value,
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Handle form submission here (e.g., send data to server)
    const formDataJson = JSON.stringify(formData)
    console.log('Form data submitted:', formDataJson)
    const response = await fetch(`http://localhost:4000/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const responseData = await response.json()

    console.log(
      'Responsed Data by the server: \n' + JSON.stringify(responseData)
    )
  }

  return (
    <div>
      <h1>Add SomethingForm</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddForm
