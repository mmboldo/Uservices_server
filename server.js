const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const categoryRoutes = express.Router();


const app = express();

app.use(express.json());

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const Category = db.category;

db.mongoose
  .connect(`mongodb+srv://myadmin:myadmin@cluster0.5nwxg.mongodb.net/tutorial5?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Uservices application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "service provider"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'service provider' to roles collection");
      });

    }
  });

  Category.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Category({
        name: "Pet"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'pet' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Housekeep"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'housekeep' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Beauty"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'beauty' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Appliance Repair"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'appliance repair' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "House Repair"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'house repair' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Personal Care"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'personal care' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Health Care"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'health care' to category collection");
      });
    }
    if (!err && count === 0) {
      new Category({
        name: "Other Services"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'other services' to category collection");
      });
    }

  });

}
