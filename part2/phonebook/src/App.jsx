import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  },[])
  
  const addPerson = (event) => {
    event.preventDefault()
    const normalizedName = newName.trim().toLowerCase()
    if (normalizedName !== '' && newPhone !== '') {
      if (!persons.find(person => person.name.toLowerCase() === normalizedName)) {
        const newPerson = {
          name: newName.trim(),
          number: newPhone.trim(),
          id: persons.length + 1
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

      <Filter value={newFilter} onChange={handleFilterChange} />
      
      <h3>Add a new</h3>
      
      <PersonForm
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newPhone={newPhone}
      handlePhoneChange={handlePhoneChange}
      />
      
      <h2>Numbers</h2>
      
      <Persons displayedList={personsToShow}/>
    </div>
    
  )

}

export default App