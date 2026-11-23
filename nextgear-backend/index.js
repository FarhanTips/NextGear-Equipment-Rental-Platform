

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
  console.log("req.query", req.query)
  const query = {};
  if (req.query) {
    if (req.query.ownerId) {
      query.ownerId = req.query.ownerId;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.availableQuantity === "low-stock") {
      query.availableQuantity = { $gte: 1, $lte: 5 };
    }

    if (req.query.availableQuantity === "full-stock") {
      query.availableQuantity = { $gt: 5 };
    }

    if (req.query.rentalType) {
      query.rentalType = req.query.rentalType;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    else {
      query.status = "Approved"
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.rentalPrice = {};

      if (req.query.minPrice) {
        query.rentalPrice.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.rentalPrice.$lte = Number(req.query.maxPrice);
      }
    }
    // search
    if (req.query.search) {
      query.$or = [
        { location: { $regex: req.query.search, $options: "i" } },
        { name: { $regex: req.query.search, $options: "i" } },
      ];
    }
  }

  // sort 
  let sortOption = {};
  if (req.query.sort) {
    if (req.query.sort === "price-asc") {
      sortOption = { rentalPrice: 1 };
    }

    if (req.query.sort === "price-desc") {
      sortOption = { rentalPrice: -1 };
    }

    if (req.query.sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    }
  }
  console.log(query)
  const result = await equipments.find(query).sort(sortOption).toArray();
  res.send(result);
})

app.get('/owner-equipments', async (req, res) => {
  const result = await equipments.find().toArray();
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
