

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
const favorites = db.collection("favorites");
const bookings = db.collection("bookings");



app.get('/', (req, res) => {
  res.send('NextGear Backend is working!')
})

app.get('/users', async (req, res) => {
  const result = await users.find().toArray();
  res.send(result);
})


// equipments

app.post('/add-equipment', async (req, res) => {
  const data = req.body;
  const result = await equipments.insertOne(data);
  res.send(result);
})

app.get('/equipments', async (req, res) => {
  console.log("req.query", req.query)
  const query = { status: "Approved" };
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

app.get('/equipments/:id', async (req, res) => {
  const id = req.params.id;
  const result = await equipments.findOne({ _id: new ObjectId(id) });
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


// favorites

app.post('/add-favorite', async (req, res) => {
  const data = req.body;
  const existingFav = await favorites.findOne({
    equipmentId: data.equipmentId, customerId: data.customerId,
  });

  if (existingFav) {
    return res.status(409).send({
      msg: "Already added to your favorites!",
    });
  }
  const result = await favorites.insertOne(data);
  res.send(result);
})

app.get('/my-favorites', async (req, res) => {
  const query = {};
  if (req.query) {
    if (req.query.customerId) {
      query.customerId = req.query.customerId
    }
  }
  const result = await favorites.find(query).toArray();
  res.send(result);
})

app.delete('/delete-favEquip/:id', async (req, res) => {
  const id = req.params.id;
  const result = await favorites.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
})

// bookings

app.post("/verified-bookings", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.send({ success: false, msg: 'Session ID is required' });
  }

  const {
    status,
    payment_status,
    payment_intent,
    metadata,
    customer_email,
    amount_total,
    currency
  } = await stripe.checkout.sessions.retrieve(sessionId);

  if (status === 'complete' && payment_status === "paid") {

    const existingSessionId = await bookings.findOne({ sessionId: sessionId });
    if (existingSessionId) {
      return res.send({ success: false, msg: "Expired sessionId!" });
    }

    const bookingData = {
      sessionId,
      status,
      payment_status,
      payment_intent,
      metadata,
      customer_email,
      paid_amount: amount_total / 100,
      currency,
      payment_date: new Date(),
    }
    const result = await bookings.insertOne(bookingData);
    res.send({ succeess: true, msg: "Payment and Booking successfull!", result })
  }

  res.send({ success: false, msg: "payment verification failed" });
})

app.get("/rentals/:id", async (req, res) => {
  const id = req.params.id;
  const result = await bookings.find({"metadata.customerId": id}).toArray();
  res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
