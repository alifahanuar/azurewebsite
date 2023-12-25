const express = require('express'); 
const { MongoClient, ObjectId } = require('mongodb'); 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express(); 
const port = process.env.PORT || 1999; 
const jwt = require('jsonwebtoken'); 

app.use(express.json()); 

// Swagger options
const options = {
    definition: {
      openapi: '3.0.0', // Specify the OpenAPI version
      info: {
        title: 'Visitor Management API',
        version: '1.0.0',
        description: 'API for managing visitors in a security system',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
      components: {
        securitySchemes: {
          jwt:{
                      type: 'http',
                      scheme: 'bearer',
                      in: "header",
                      bearerFormat: 'JWT'
          },
        },
      },
          security:[{
              "jwt": []
    }]
    },
    apis: ['app.js'], // Path to the API routes file(s)
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  
  // Serve Swagger documentation
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// MongoDB connection URL 
const uri = 
'mongodb+srv://Alifah:FXwzuFbI9bOat0w6@cluster0.ali2uob.mongodb.net/VisitorManagement'; 
// Create a new MongoClient 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
// Connect to MongoDB 
client.connect() 
.then(() => { 
console.log('Connected to MongoDB'); 
}) 
.catch((error) => { 
console.error('Error connecting to MongoDB:', error); 
}); 

// Define collection names 
const db = client.db('VisitorManagement'); 
// const usersCollection = db.collection('users'); 
const visitorsCollection = db.collection('visitors'); 
const securityCollection = db.collection('security'); 
const hostelCollection = db.collection('hostel'); 
const blockCollection = db.collection('block'); 
const vehicleCollection = db.collection('vehicle'); 
const adminsCollection = db.collection('admins'); 
const visitorPassCollection = db.collection('visitorpass');

function login(reqUsername, reqPassword) { 
  return adminsCollection.findOne({ username: reqUsername, password: reqPassword }) 
    .then(matchAdmins => { 
      if (!matchAdmins) { 
        return { 
          success: false, 
          message: "Admin not found!" 
        }; 
      } else { 
        return { 
          success: true, 
          users: matchAdmins
        }; 
      } 
    }) 
    .catch(error => { 
      console.error('Error in login:', error); 
      return { 
        success: false, 
        message: "An error occurred during login." 
      }; 
    }); 
} 
  

function register(reqUsername, reqPassword, reqName, reqEmail) { 
  return adminsCollection.insertOne({ 
    username: reqUsername, 
    password: reqPassword, 
    name: reqName, 
    email: reqEmail 
  }) 
    .then(() => { 
      return "Registration Admin Successful!"; 
    }) 
    .catch(error => {      console.error('Error in register:', error); 
      return "An error occurred during registration."; 
    }); 
} 



function generateToken(userData) { 
  const token = jwt.sign(userData, 'inipassword'); 
  return token; 
} 
function verifyToken(req, res, next) { 
  let header = req.headers.authorization; 
  console.log(header); 
 
  let token = header.split(' ')[1]; 
  jwt.verify(token, 'inipassword', function (err, decoded) { 
    if (err) { 
      res.send('Invalid Token'); 
    } 
 
    req.user = decoded; 
    next(); 
  }); 
} 
 
// Login route 
app.post('/login', (req, res) => { 
  console.log(req.body); 
 
  let result = login(req.body.username, req.body.password); 
  result.then(response => { 
    console.log(response); // Log the response received 
 
    if (response.success) { 
      let token = generateToken(response.users); 
      res.send(token);    } else { 
      res.status(401).send(response.message); 
    } 
  }).catch(error => { 
    res.status(500).json({ error: 'An error occurred during login', details: error.message });
  }); 
}); 


 
// Register route 
app.post('/register', (req, res) => { 
  console.log(req.body); 
 
  let result = register(req.body.username, req.body.password, req.body.name, req.body.email); 
  result.then(response => { 
    res.send(response); 
  }).catch(error => { 
    console.error('Error in register route:', error); 
    res.status(500).send("An error occurred during registration."); 
  }); 
}); 

 //Create a visitor 
app.post('/visitorData', verifyToken, (req, res) => { 
  const { 
    visitorID, 
    visitorName, 
    age,
    gender,
    phoneNumber, 
    visitingPurpose, 
    visitingPerson, 
    visitedDate, 
    timeIn, 
    timeOut,   vehicleType 
  } = req.body; 
 
  const visitorData = { 
    visitorID, 
    visitorName, 
    age,
    gender,
    phoneNumber, 
    visitingPurpose, 
    visitingPerson, 
    visitedDate, 
    timeIn, 
    timeOut, 
    vehicleType 
  }; 
  visitorsCollection 
    .insertOne(visitorData) 
    .then(() => { 
      res.send(visitorData); 
    }) 
    .catch((error) => { 
      console.error('Error creating visitor:', error); 
      res.status(500).send('An error occurred while creating the visitor'); 
    }); 
}); 
 
// Admin Issue Visitor Pass
app.post('/issuepass', verifyToken, async (req, res) => {
    const { _Id, issuedBy, validUntil } = req.body;
  
    try {
      const visitorPass = db.collection('visitorpass');
  
      const newPass = {
        _Id,
        issuedBy,
        validUntil,
        issuedAt: new Date(),
      };
  
      await visitorPass.insertOne(newPass);
      res.status(201).json( 'Visitor pass issued successfully' );
    } catch (error) {
      console.error('Issue Pass Error:', error.message);
      res.status(500).json('An error occurred while issuing the pass');
    }
  });
  
  
  // Visitor Retrieve Pass
  app.get('/retrievepass/:_id', async (req, res) => {
    const _Id = req.params._Id;
  
    try {
      const visitorPass = db.collection('visitorpass');
      const pass = await visitorPass.findOne({ _Id });
  
      if (!pass) {
        return res.status(404).json({ error: 'No pass found for this visitor' });
      }
  
      res.json(pass);
    } catch (error) {
      console.error('Retrieve Pass Error:', error.message);
      res.status(500).json({ error: 'An error occurred while retrieving the pass', details: error.message });
    }
  });

// Update a visitor 
app.put('/visitor/:id', verifyToken, async (req, res) => { 
  const { id } = req.params; 
  const visitorData = req.body; 
 
  try { 
    const visitorObjectId = new ObjectId(id); 
    const updateResult = await visitorsCollection.updateOne({ _id: visitorObjectId }, { $set: 
visitorData }); 
    if (updateResult.modifiedCount === 1) { 
      res.send('Visitor updated successfully'); 
    } else { 
      res.status(404).send('Visitor not found'); 
    } 
  } catch (error) { 
    console.error('Error updating visitor:', error); 
    res.status(500).send('Error updating visitor'); 
  } 
}); 
 
// Delete a visitor 
app.delete('/visitor/:id', verifyToken, async (req, res) => { 
  const { id } = req.params; 
 
  try { 
    const visitorObjectId = new ObjectId(id); 
    const deleteResult = await visitorsCollection.deleteOne({ _id: visitorObjectId }); 
 
    if (deleteResult.deletedCount === 1) { 
      res.send('Visitor deleted successfully'); 
    } else { 
      res.status(404).send('Visitor not found'); 
    } 
  } catch (error) { 
    console.error('Error deleting visitor:', error); 
    res.status(500).send('Error deleting visitor'); 
  } 
}); 
 
// View all visitors 
app.get('/allvisitors', async (req, res) => { 
  try {    const visitors = await visitorsCollection.find().toArray(); 
    res.send(visitors); 
  } catch (error) { 
    console.error('Error viewing visitors:', error); 
    res.status(500).send('Error viewing visitors'); 
  } 
}); 
 
//Security register 
app.post('/security-register', (req, res) => { 
  const { securityID, name, workshift} = req.body; 
 
  if (!securityID ||!name || !workshift ) { 
    res.status(500).send('Missing required fields'); 
    return; 
  } 
 
  securityCollection 
    .insertOne({ securityID, name, workshift }) 
    .then(() => { 
      res.send('Security registered successfully'); 
    }) 
    .catch((error) => { 
      console.error('Error registering security:', error); 
      res.status(500).send('An error occurred while registering the security'); 
    }); 
}); 
 
// Security login 
app.post('/security-login', async (req, res) => { 
  const { securityID, name } = req.body; 
 
  try { const security = await securityCollection.findOne({ securityID, name }); 
 
    if (security) { 
      res.send('Security logged in successfully'); 
    } else { 
      res.status(401).send('Invalid username or password'); 
    } 
  } catch (error) { 
    console.error('Error logging in:', error); 
    res.status(500).send('Error logging in'); 
  } 
}); 
 
// Security logout 
app.post('/security/logout', (req, res) => { 
  res.send('Security logged out successfully'); 
}); 
 
// Visitor access information 
app.get('/visitorAccess', (req, res) => { 
  const phoneNumber = req.body.phoneNumber; 
 
  visitorsCollection 
    .find({ phoneNumber }) 
    .toArray() 
    .then((visitors) => { 
      if (visitors.length === 0) { 
        res.send('No visitors found with the given contact number'); 
      } else { 
        res.send(visitors); 
      } 
    }) 
    .catch((error) => { 
      console.error('Error retrieving visitors by contact:', error);      res.status(500).send('An error occurred while retrieving visitors by contact'); 
    }); 
}); 
 
// View a specific visitor 
app.get('/visitor',verifyToken, (req, res) => { 
  visitorsCollection 
    .find({}) 
    .toArray() 
    .then((visitors) => { 
      res.json(visitors); 
    }) 
    .catch((error) => { 
      console.error('Error retrieving visit details:', error); 
      res.status(500).send('An error occurred while retrieving visit details'); 
    }); 
}); 
 
// View all hostel 
app.get('/hostel', async (req, res) => { 
  try { 
    const hostel = await hostelCollection.find().toArray(); 
    res.send(hostel); 
  } catch (error) { 
    console.error('Error viewing hostel:', error); 
    res.status(500).send('Error viewing hostel'); 
  } 
}); 
 
// View all block 
app.get('/block', async (req, res) => { 
  try { 
    const block = await blockCollection.find().toArray(); 
    res.send(block);  } catch (error) { 
    console.error('Error viewing block:', error); 
    res.status(500).send('Error viewing block'); 
  } 
}); 
 
// View all vehicle 
app.get('/vehicle', async (req, res) => { 
  try { 
    const vehicle = await vehicleCollection.find().toArray(); 
    res.send(vehicle); 
  } catch (error) { 
    console.error('Error viewing vehicle:', error); 
    res.status(500).send('Error viewing vehicle'); 
  } 
}); 
 


app.use(express.json()) 
 
 
// Start the server 
app.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
});