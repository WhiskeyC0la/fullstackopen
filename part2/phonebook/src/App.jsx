import { useState } from 'react'

const App = () => {
   const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const addPerson = (event) => {
    event.preventDefault()
    const normalizedName = newName.trim().toLowerCase()
    if (normalizedName !== '' && newPhone !== '') {
      if (!persons.find(person => person.name.toLowerCase() === normalizedName)) {
        const newPerson = {
          name: newName.trim(),
          number: newPhone.trim()
        }
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewPhone('')
      } else {
        alert (`${newName.trim()} is already added to phonebook`)
      }
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    const validInputNum = /^[+\d-]*$/.test(event.target.value)
    if(validInputNum) {
      setNewPhone(event.target.value)
    }
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  const personsToShow = newFilter.trim() === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.trim().toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
          filter shown with <input value={newFilter}
          onChange={handleFilterChange}/>
        </div>
      <form onSubmit={addPerson}>
        <h2>add a new</h2>
        <div>
          name: <input value={newName}
          onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newPhone}
          onChange={handlePhoneChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    </div>
    
  )

}

export default App