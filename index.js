require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(express.static("dist"));
const Persons = require("./models/persondb");
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

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>THE PHONEBOOK BACKEND<h1/>");
});

app.get("/api/persons", (request, response) => {
  Persons.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toString();
  Persons.countDocuments({}).then((count) => {
    response.send(
      `Phonebook has info for ${count} people </br> ${currentTime}`,
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Persons.find(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Persons.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name && !body.number) {
    response
      .status(400)
      .json({ error: "Name and Number both are required!!!" });
  }
  const person = new Persons({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) =>
      response.status(400).send(`Something went wrong. ${error.message}`),
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
