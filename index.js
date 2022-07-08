require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const Person = require('./models/person');

const app = express();

morgan.token('content', (request, response) => {
  if (Object.keys(request.body).length > 0) {
    return JSON.stringify(request.body);
  }

  return ' ';
});

function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  next(error);
}

app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
);
app.use(express.static('build'));

const url = process.env.MONGODB_URI;

console.log(`Connecting to ${url}`);
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
  });

function generateId() {
  return Math.round(Math.random() * 1000000);
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((fetchedPersons) => {
    response.json(fetchedPersons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      }

      return response.status(404).json({ error: 'id not found' });
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((personsCount) => {
    let responseString = `<p>Phonebook has info for ${personsCount} people</p>`;
    responseString += `<p>${new Date().toString()}</p>`;
    response.send(responseString);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons/', (request, response) => {
  const { body } = request;

  if (!body.name) {
    return response.status(400).json({ error: 'name not provided' });
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number not provided' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const editedPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, editedPerson, { new: true })
    .then((changedPerson) => {
      response.json(changedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
