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

// use res.render to load up an ejs view file


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getVehicleData() {
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

app.get('/', async (req,res) => {

  let result = await getVehicleData();

  console.log("myResults:", result);

  res.render('index', {
    pageTitle: "Vehicle Data",
    vehicleData: result

  });

});

app.get('/add', async (req,res) => {
    

});

app.listen(port, () => {
  console.log(`quebec app listening on port ${port}`)
})