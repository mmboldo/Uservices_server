const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Category = new Schema({
    name: {
        type: String,
        
    },
    serviceProvider: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceProvider"
        }
      ]
});

module.exports = mongoose.model('Category', Category);
