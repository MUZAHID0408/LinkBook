const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(express.static("dist"));

morgan.token("reqData", (request) => {
  //console.log(request.body);
  const data = JSON.stringify(request.body);

  return data;
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqData",
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>THE PHONEBOOK BACKEND<h1/>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numPeople = persons.length;
  const currentTime = new Date().toString();

  // console.log(numPeople);
  // console.log(currentTime);
  response.send(
    `Phonebook has info for ${numPeople} people </br> ${currentTime}`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => Number(person.id) !== Number(id));
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  if (!request.body) {
    return response.status(400).end();
  }

  const newName = request.body.name;
  const newNumber = request.body.number;
  const newId = Math.floor(Math.random() * 100000);
  const personExist = persons.find(
    (person) => person.name.toLowerCase() === newName.toLowerCase(),
  );

  if (personExist) {
    return response.status(400).json({ Error: "Name must be unique" });
  }
  if (!newName) {
    return response.status(400).json({ Error: "Name is required" });
  }
  if (!newNumber) {
    return response.status(400).json({ Error: "Number is required" });
  }

  const newPerson = {
    id: newId,
    number: newNumber,
    name: newName,
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
