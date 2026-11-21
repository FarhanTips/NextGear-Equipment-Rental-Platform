

import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';


const app = express();
const port = process.env.port || 5000;


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



app.get('/', (req, res) => {
  res.send('NextGear Backend is working!')
})

app.get('/users', async (req, res) => {
  const result = await users.find().toArray();
  res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
