const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')
mongoose.connect(url, { family: 4 })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((err) => {
        console.log('error connecting to MongoDB', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, 'Person name is required']
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Person phone number is required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema, 'persons')