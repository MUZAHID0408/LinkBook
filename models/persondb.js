require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL, { family: 4 })
  .then((response) => {
    console.log("Connected to MONGODB server");
  })
  .catch((error) => {
    console.log(`Database connection failed ${error.message}`);
  });

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneBookSchema.set("toJSON", {
  transform: (doc, returnedOBJ) => {
    returnedOBJ.id = returnedOBJ._id.toString();
    delete returnedOBJ._id;
    delete returnedOBJ.__v;
  },
});
module.exports = mongoose.model("Persons", phoneBookSchema);
