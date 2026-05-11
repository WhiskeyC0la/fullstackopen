require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const app = express()

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people </p>
                <p>${new Date()}</p>
            `)
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404)
                            .json({error: '404 Not found'})
            }
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            if(!deletedPerson) {
                return response.status(404).end()
            }
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({error: 'Important information is missing'})
    }

    Person.find({ name: body.name })
        .then(existingPerson => {
            if(existingPerson.length > 0) {
                return response.status(409).json({error: 'Name must be unique'})
            }
            const person = new Person({
                name: body.name,
                number: body.number
            })

            person.save().then(savedPerson => {
                response.status(201).json(savedPerson)
            })
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})