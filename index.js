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

app.get('/api/people', (request, response) => {
    response.json(phoneBook) //send JSON to client
})

app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id) //Receive id from client
    const person = phoneBook.find(person => person.id === id)
    console.log(id, person);

    if (person) {
        response.json(person)
    } else {
        response.status(404).end() //send code 404 (not found) to client
    }

})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id) //Receive id from client
    console.log(id);
    phoneBook = phoneBook.filter(person => person.id !== id)

    response.status(204).end() //send code 204 (no content) to client
})

app.post('/api/people', (request, response) => {
    const body = request.body

    //Check if request has a name and number
    if (body.name == null || body.number == null) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    //Check if request has the same name as someone in the phonebook
    if (phoneBook.filter(i => i.name === body.name).length > 0) {
        return response.status(409).json({ 
            error: 'name already exists' 
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        important: body.number,
    }

    phoneBook = phoneBook.concat(person)

    response.json(person) //sends JSON back to client, not necessary but useful for debugging
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})