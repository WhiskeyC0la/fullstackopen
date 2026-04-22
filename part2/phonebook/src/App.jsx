import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  },[])
  
  const addPerson = (event) => {
    event.preventDefault()
    const normalizedName = newName.trim().toLowerCase()
    if (normalizedName !== '' && newPhone !== '') {
      const findingResult = persons.find(person =>
            person.name.trim().toLowerCase() === normalizedName)
      if (!findingResult) {
        const newPerson = {
          name: newName.trim(),
          number: newPhone.trim()
        }
        personService
          .create(newPerson)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewPhone('')
            setMessageType('success')
            setMessage(
              `Added ${returnedPerson.name}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      } else {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const existingPerson = findingResult
          const changedPerson = {...existingPerson, number: newPhone.trim()}
          personService
            .update(existingPerson.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
              setNewName('')
              setNewPhone('')
              setMessageType('success')
              setMessage(
                `${returnedPerson.name}'s phone number was successfully updated`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch((error) => {
              console.log(error)
              setMessageType('error')
              setMessage(
                `Information of ${existingPerson.name} has already been removed from server`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(person => person.id !== existingPerson.id))
            })
        }
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

  const deleteUser = (id) => {
    const person = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setMessageType('success')
        setMessage(
          `${person.name} was successfully removed from phonebook`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        console.log(error)
        setMessageType('error')
        setMessage(
          `Information of ${person.name} has already been removed from server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType}/>
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
      
      <Persons displayedList={personsToShow} deleteUser={deleteUser}/>
    </div>
    
  )

}

export default App