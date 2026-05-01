const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://phonebookUser:${password}@cluster0.fxypfac.mongodb.net/persons?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Persons = mongoose.model("Persons", phoneBookSchema);

if (process.argv.length >= 5) {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Persons({
    name: personName,
    number: personNumber,
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
if (process.argv.length < 4) {
  Persons.find({}).then((result) => {
    console.log("Phonebook: ");
    result.forEach((personInfo) =>
      console.log(`${personInfo.name} ${personInfo.number}`),
    );
    mongoose.connection.close();
  });
}
