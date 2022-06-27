const express = require('express');

const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
