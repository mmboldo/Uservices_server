const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = express.Router();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
const User = require("./app/models/user.model");
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

// route to get all users
app.get("/users", (req, res) => {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// route to get user by id
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id, function (err, user) {
    res.json(user);
  });
});

//route to update the User Profile
app.post('/update/:id', (req, res) => {
    User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).send('data is not found');
    } else {
      user.firstName = req.body.firstName,
      user.lastName = req.body.lastName,
      user.email = req.body.email,
      user.address = req.body.address,
      user.province = req.body.province,
      user.serviceProvider = req.body.serviceProvider,
      user.password = bcrypt.hashSync(req.body.password, 8)

      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if(req.body.serviceProvider === true) {
          if (req.body.roles) {
            Role.find(
              {
                name: { $in: req.body.roles }
              },
              (err, roles) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
      
                user.roles = roles.map(role => role._id);
                user.save(err => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
      
                  res.send({ message: "User was registered successfully1!" });
                });
              }
            );
          } else {
            Role.findOne({ name: "service provider" }, (err, role) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
      
              user.roles = [role._id];
              user.save(err => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
      
                res.send({ message: "User was registered successfully2!" });
              });
            });
          }
        } else {
          if (req.body.roles) {
            Role.find(
              {
                name: { $in: req.body.roles }
              },
              (err, roles) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
      
                user.roles = roles.map(role => role._id);
                user.save(err => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
      
                  res.send({ message: "User was registered successfully3!" });
                });
              }
            );
          } else {
            Role.findOne({ name: "user" }, (err, role) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
      
              user.roles = [role._id];
              user.save(err => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
      
                res.send({ message: "User was registered successfully4!" });
              });
            });
          }
        }
    
        
      });
    }
  })
})

//route to get the roles
app.get("/roles", (req, res) => {
  Role.find(function (err, roles) {
    if (err) {
      console.log(err);
    } else {
      res.json(roles);
    }
  });
});


// find role by id
// route to get user by id
app.get("/roles/:id", (req, res) => {
  Role.findById(req.params.id, function (err, role) {
    res.json(role);
  });
});



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
