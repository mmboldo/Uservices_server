const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require('request');
const multer = require("multer");


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const app = express();

global.__basedir = __dirname;

app.use(express.json());

// Part 1 for the File Upload fix
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Part 2 for the File Upload fix: Proxy for CORS Policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Part 1 for the File Upload fix: Route usingProxy for CORS Policy
app.post('/files', (req, res) => {
  request(
    { url: 'http://localhost:8080' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});



const initRoutes = require("./app/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const User = require("./app/models/user.model");
const Complaint = db.complaint;
const Role = db.role;
const Category = db.category;
const ServiceProvider = db.serviceProvider;


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
        if (req.body.serviceProvider === true) {
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

//to store images on MongoDb
const storage = multer.diskStorage({
  destination: (req, file, callback) => {

    callback(null, "../Uservices_client/public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


//route to register Service Provider Profile, register user id as reference
app.post("/serviceProviderRegister/:id/:id2", upload.array("profileImages", 4), (req, res, next) => {
  const reqFiles = [];
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(req.files[i].filename)
  }

  const serviceProvider = new ServiceProvider({
    companyName: req.body.companyName,
    description: req.body.description,
    price: req.body.price,
    availability: req.body.availability,
    profileImages: reqFiles
  });
  serviceProvider.save((err, serviceProvider) => {
    try {
      if (req.params.id && req.params.id2) {
        serviceProvider.user = [req.params.id];
        serviceProvider.category = [req.params.id2];
        serviceProvider.save();
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  })
});

//route to get current user Service Provider Profiles
app.get("/serviceProviders/:id", (req, res) => {
  ServiceProvider.find({user: [req.params.id]}, function (err, serviceProviders) {
    res.json(serviceProviders);
  });
})

//route to get the Service Providers Companies Name
app.get("/serviceProviders", (req, res) => {
  ServiceProvider.find(function (err, serviceProviders) {
    if (err) {
      console.log(err);
    } else {
      res.json(serviceProviders);
    }
  })
})

//route to find the Service Provider by Companies Name
app.get("/serviceProviders/:companyName", (req, res) => {
  ServiceProvider.findOne({ companyName: req.params.companyName }, function (err, serviceProvider) {
    res.json(serviceProvider);
  });
})


//find category by name
app.get("/categories/:name", (req, res) => {
  Category.findOne({ name: req.params.name }, function (err, category) {
    res.json(category);
  });
});


//find category by id
app.get("/categories/:id", (req, res) => {
  Category.findById(req.params.id, function(err, onecategory) {
    res.json(onecategory);
  });
});

//route to get the categories
app.get("/categories", (req, res) => {
  Category.find(function (err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.json(categories);
    }
  });
});

//route to post complaints
app.post("/complaints/:id", (req, res) => {
  const complaint = new Complaint({
    complaintDescription: req.body.complaintDescription,
    user: [req.params.id]
  });
  complaint.save()
    .then(complaint => {
      res.status(200).json({ 'complaint': 'complaint added successfully' }); // 200 indicates that the update has been done sucessfully
    })
    .catch(err => {
      res.status(400).send('adding new todo failed.');
    });
})


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
