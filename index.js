const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

//connect to mondoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mt8kgrw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database collection
    const accountantsCollection = client
      .db("CAConnectionsNetworkDB")
      .collection("Accountants");

    //get all accountants to db
    app.get("/accountants", async (req, res) => {
      const users = await accountantsCollection.find().toArray();
      res.send(users);
    });

    //get  accountant by name
    app.get("/accountant/:name", async (req, res) => {
      const name = req.params.name;

      try {
        const accountant = await accountantsCollection.findOne({ name: name });
        if (accountant) {
          res.json(accountant);
        } else {
          res.status(404).json({ message: "Accountant not found" });
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CA Connection Network Server is running....!");
});

app.listen(port, () => {
  console.log(`CA Connection Network on port ${port}`);
});
