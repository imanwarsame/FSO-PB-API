require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./modules/person');
const cors = require('cors');

const app = express();

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};


//Middleware
app.use(express.json()); //JSON-parser required for requests
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('build'));



/* This is a GET request to the server. It is requesting the server to send the phonebook and date information to the
client. */
app.get('/info', (request, response) => {
	Person.countDocuments({}, function( err, count){
		const infoPage = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
        `;
		response.send(infoPage);
	});

});


/* This is a GET request to the server. It is requesting the server to send the phonebook to the
client. */
app.get('/api/people', (request, response) => {
	Person.find({}).then(people => {
		response.json(people); //send JSON to client
	});
});


/* This is a GET request to the server. It is requesting the server to send a specific person to the
client. */
app.get('/api/people/:id', (request, response, next) => {
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person);
		} else {
			response.status(404).end(); //This will only run if the id is the correct length, but can't find a match
		}
	})
		.catch(error => next(error));
});



/* This is a POST request to the server. It is requesting the server to add a new person to the
phonebook. */
app.post('/api/people', (request, response, next) => {
	const body = request.body;

	//Check if request has a name and number
	if (body.name === null || body.number === null) {
		return response.status(400).json({
			error: 'content missing'
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});


	person.save()
		.then(savedPerson => {
			response.json(savedPerson);
		})
		.catch(error => next(error));
});



/* This is a PUT request to the server. It is requesting the server to update a specific person in the
phonebook. */
app.put('/api/people/:id', (request, response, next) => {
	const { name, number } = request.body;

	//Added the optional new: true parameter which means event handler
	//will use the new object and not the original. This is important
	Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			response.json(updatedPerson);
		})
		.catch(error => next(error));
});


/* This is a DELETE request to the server. It is requesting the server to delete a specific person from
the phonebook. */
app.delete('/api/people/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end(); //send code 204 (no content) to client
		})
		.catch(error => next(error));
});


app.use(errorHandler); //This must be loaded last after ALL middleware and routes


const PORT = process.env.PORT || 3001; //Changed to use PORT 8080 defined in the toml file

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});