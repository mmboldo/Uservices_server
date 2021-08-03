const mongoose = require("mongoose");

const Complaint = mongoose.model(
  "Complaint",
  new mongoose.Schema({
    complaintDescription: String, 
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  })
);

module.exports = Complaint;
