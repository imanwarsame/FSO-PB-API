require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/person')
const cors = require('cors')

const app = express()
app.use(express.json()) //JSON-parser required for requests
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let phoneBook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    let newId = Math.floor(Math.random() * 4356346);

    while (phoneBook.filter(i => i.id === newId).length > 0) {
        newId = Math.floor(Math.random() * 4356346);
        console.log("ID clash");
    }

    return newId
}


app.get('/info', (request, response) => {
    const infoPage = `
    <p>Phonebook has info for ${phoneBook.length} people</p>
    <p>${new Date()}</p>
    `;
    response.send(infoPage)
})


/* This is a GET request to the server. It is requesting the server to send the phonebook to the
client. */
app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        response.json(people) //send JSON to client
    })
})


/* This is a GET request to the server. It is requesting the server to send a specific person to the
client. */
app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})



app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id) //Receive id from client
    console.log(id);
    phoneBook = phoneBook.filter(person => person.id !== id)

    response.status(204).end() //send code 204 (no content) to client
})



/* This is a POST request to the server. It is requesting the server to add a new person to the
phonebook. */
app.post('/api/people', (request, response) => {
    const body = request.body

    //Check if request has a name and number
    if (body.name == null || body.number == null) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})




const PORT = process.env.PORT || 3001 //Changed to use PORT 8080 defined in the toml file

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})