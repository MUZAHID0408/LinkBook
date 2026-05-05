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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (phoneNumber) => {
        return phoneNumber.length >= 9 && /^\d{2,3}-\d+$/.test(phoneNumber); //studied it using AI... Mongoose documentation is not that great for me....
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
  },
});

phoneBookSchema.set("toJSON", {
  transform: (doc, returnedOBJ) => {
    returnedOBJ.id = returnedOBJ._id.toString();
    delete returnedOBJ._id;
    delete returnedOBJ.__v;
  },
});
module.exports = mongoose.model("Persons", phoneBookSchema);
