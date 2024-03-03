require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser =  require("body-parser");


// set the view engine to ejs
let path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))

// use res.render to load up an ejs view file


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectVehicleData() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      const result = await client.db("quebec-database").collection("quebec").find().toArray();
      console.log("mongo call await inside f/n: ", result);
      return result; 
    } 
    catch(err) {
      console.log("getVehicleData() error: ", err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }

// Read from Database
app.get('/', async (req,res) => {

  let result = await connectVehicleData();

  console.log("myResults:", result);

  res.render('index', {
    pageTitle: "Vehicle Data",
    vehicleData: result

  });

});

//Create to Database
app.post('/addRegistration', async (req, res) => {

    try {
      // console.log("req.body: ", req.body) 
      client.connect; 
      const collection = client.db("quebec-database").collection("quebec");
      
      //draws from body parser 
      console.log(req.body);
      
      await collection.insertOne(req.body);
        
  
      res.redirect('/');
    }
    catch(err){
      console.log(err)
    }
    finally{
     // client.close()
    }
  
  });


app.listen(port, () => {
  console.log(`quebec app listening on port ${port}`)
})