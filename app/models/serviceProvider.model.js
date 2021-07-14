const mongoose = require("mongoose");

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  new mongoose.Schema({
    subcategory: String, 
    description: String,
    price: String,
    availability: String
  })
);

module.exports = ServiceProvider;
