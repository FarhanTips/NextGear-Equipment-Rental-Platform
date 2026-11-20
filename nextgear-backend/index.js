

import 'dotenv/config';
import express from 'express';


const app = express();
const port = process.env.port || 5000;

app.get('/', (req, res) => {
  res.send('NextGear Backend is working!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
