const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {    
    response.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${new Date()}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(!person) {
        return response.status(404).json({error: '404 Not found'})
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const originLength = persons.length
    persons = persons.filter(person => person.id !== id)

    if(originLength > persons.length) {
        return response.status(204).end()
    }
    return response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({error: 'Important information is missing'})
    }

    const existingPerson = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

    if(existingPerson) {
        return response.status(409).json({error: 'Name must be unique'})
    } 

    const generateId = () => {
        const id = Math.floor(Math.random()* 1000)
        return String(id)
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.status(201).json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})