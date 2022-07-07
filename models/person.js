const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    /* eslint-enable */
  }
});

module.exports = mongoose.model('Person', personSchema);
