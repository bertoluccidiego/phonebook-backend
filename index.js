const express = require('express');
const morgan = require('morgan');

const app = express();

morgan.token('content', (request, response) => {
  if (Object.keys(request.body).length > 0) {
    return JSON.stringify(request.body);
  }

  return ' ';
});

app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
);

function generateId() {
  return Math.round(Math.random() * 1000000);
}

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).json({ error: 'id not found' });
  }

  return response.json(person);
});

app.get('/info', (request, response) => {
  let responseString = `<p>Phonebook has info for ${persons.length} people</p>`;
  responseString += `<p>${new Date().toString()}</p>`;
  response.send(responseString);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).json({ error: 'id not found' });
  }

  persons = persons.filter((p) => p.id === id);

  return response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
  const { body } = request;

  if (!body.name) {
    return response.status(400).json({ error: 'name not provided' });
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number not provided' });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({ error: 'person already exists' });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  return response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
