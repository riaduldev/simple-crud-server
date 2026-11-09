import express from 'express';
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-2cxpoee-shard-00-00.ey9ljrw.mongodb.net:27017,ac-2cxpoee-shard-00-01.ey9ljrw.mongodb.net:27017,ac-2cxpoee-shard-00-02.ey9ljrw.mongodb.net:27017/?ssl=true&replicaSet=atlas-bljlko-shard-0&authSource=admin`);




export async function connectToMongoDB() {
    try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const connectedClient =await connectToMongoDB();
const db = connectedClient.db('simpleCrudDB');
const users = db.collection('users');


app.get('/', (req, res) => {
    res.send('simple CRUD is running')
})

app.get('/users' , async(req, res) => {
    const cursor = users.find({})
    const allUsers = await cursor.toArray();
    res.send(allUsers)
})

app.get('/users/:id' , async(req, res) => {
    console.log("params in the server", req.params);
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}


    const result = await users.findOne(query)
    res.send(result)
})


app.post('/users', async(req, res) => {
    const newUser = req.body;
    
    console.log('Adding new user',newUser);
    const result = await users.insertOne(newUser);
    res.send(result)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
