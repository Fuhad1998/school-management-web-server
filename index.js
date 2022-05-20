const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const product = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run (){
    try{
        await client.connect();
        const database = client.db('school_management');
        const serviceCollection = database.collection('services');
        const enrollCollection = database.collection('enrolled');
        const userCollection = database.collection('users');



        // get services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        app.post('/services', async(req, res)=>{
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.json(result)
        })

        app.delete('/services/:id', async (req, res) =>{
            const id = req.params.id;
            
            const query = {_id: product(id)};
            const result = await serviceCollection.deleteOne(query)
            
            res.json(result)
        })
            
        // post enrolled

        app.post('/enrolled', async(req, res)=>{
            const enrolls = req.body;
            const result = await enrollCollection.insertOne(enrolls);
            res.json(result)
        })
       
        app.get('/enrolled', async (req, res) => {
            const cursor = enrollCollection.find({});
            const enrolls = await cursor.toArray();
            res.send(enrolls)
        })

        // post users from firebase

        app.post('/users', async(req, res)=>{
            const users = req.body;
            const result = await userCollection.insertOne(users)
            
            res.json(result)
        })

        app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email}
            const options = {upsert: true}
            const updateDoc = {$set: user}
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        app.put('/users/admin', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email}
            const updateDoc ={$set: {role: 'admin'}}
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email: email}
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin= true;
            }
            res.json({admin: isAdmin})
        })

    }
    finally{
    //    await client.close()
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello school management')
  })
  
  app.listen(port, () => {
    console.log(`listening at port`, port)
  })