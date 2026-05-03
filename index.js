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

app.get("/api/persons", (request, response, next) => {
  Persons.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const currentTime = new Date().toString();
  Persons.countDocuments({})
    .then((count) => {
      response.send(
        `Phonebook has info for ${count} people </br> ${currentTime}`,
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Persons.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

//Completed 3.15
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Persons.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

//create a person
app.post("/api/persons", (request, response, next) => {
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
    .catch((error) => next(error));
});

//update a person number
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  const id = request.params.id;

  Persons.findByIdAndUpdate(
    id,
    { name, number },
    { returnDocument: "after", runValidators: true, context: "query" },
  )
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

//Some MIDDLEWARES

const handleUnknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint!!!" });
};
app.use(handleUnknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error);
  if (error.message === "castError") {
    return response.status(400).send({ error: "Malformed ID" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
