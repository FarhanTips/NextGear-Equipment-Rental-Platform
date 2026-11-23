

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';


const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();

const db = connectedClient.db("NextGear");
const users = db.collection("user");
const equipments = db.collection("equipments");



app.get('/', (req, res) => {
  res.send('NextGear Backend is working!')
})

app.get('/users', async (req, res) => {
  const result = await users.find().toArray();
  res.send(result);
})

app.post('/add-equipment', async (req, res) => {
  const data = req.body;
  const result = await equipments.insertOne(data);
  res.send(result);
})

app.get('/equipments', async (req, res) => {
  const query = {};
  if (req.query) {
    if (req.query.ownerId) {
      query.ownerId = req.query.ownerId;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.availableQuantity) {
      query.availableQuantity = req.query.availableQuantity;
    }
    if (req.query.rentalType) {
      query.rentalType = req.query.rentalType;
    }
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }
  }
  const result = await equipments.find(query).toArray();
  res.send(result);
})

app.delete('/delete-equipment/:id', async (req, res) => {
  const id = req.params.id;
  const result = await equipments.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
})

app.patch('/update-equipment/:id', async (req, res) => {
  const id = req.params.id;
  const result = await equipments.updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );
  res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
