const express = require('express')
const app = express()
app.use(express.json()) //JSON-parser required for requests

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
    const maxId = phoneBook.length > 0
        ? Math.max(...phoneBook.map(n => n.id))
        : 0
    return maxId + 1
}


app.get('/info', (request, response) => {
    const infoPage = `
    <p>Phonebook has info for ${phoneBook.length} people</p>
    <p>${new Date()}</p>
    `;
    response.send(infoPage)
})

app.get('/api/people', (request, response) => {
    response.json(phoneBook) //send JSON to client
})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id) //Receive id from client
    console.log(id);
    phoneBook = phoneBook.filter(person => person.id !== id)

    response.status(204).end() //send code 204 (no content) to client
})


app.post('/api/people', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        important: body.number,
    }

    phoneBook = phoneBook.concat(person)

    response.json(person) //sends JSON back to client, not necessary but useful for debugging
    return response.status(201).end() //send code 201 (created) to client
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})