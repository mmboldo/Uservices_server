const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.category = require("./category.model");
db.serviceProvider = require("./serviceProvider.model");
db.complaint = require("./complaint.model");

db.ROLES = ["user", "service provider"];

module.exports = db;