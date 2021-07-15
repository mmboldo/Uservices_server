const mongoose = require("mongoose");

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  new mongoose.Schema({
    subcategory: String, 
    description: String,
    price: String,
    availability: String,
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ]
  })
);

module.exports = ServiceProvider;
