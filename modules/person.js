const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI //grabs URI from confidential .env file

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})


//Set schema to define properties for single person
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{2,3}-\d+$/.test(v); //String must start with 2 or 3 numbers, then a -, then at least one other number
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
})
  

//Modify toJSON method to ensure id is a string and delete _id and __v
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


//Export module to be used in the index.js file
module.exports = mongoose.model('Person', personSchema)