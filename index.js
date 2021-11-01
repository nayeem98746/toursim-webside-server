const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8ils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect()
        const database = client.db('tourismWebside');
        const servicesCollection = database.collection('services')
        const imagesCollection = database.collection('images')
        const vehicleCollection = database.collection('vehicle')
        const userCollection = database.collection('users')
        

        // get single service
        app.get('/services/:id', async (req, res)=> {
           const id = req.params.id
           console.log('getting specific service' , id)
           const query ={_id: ObjectId(id)};
           const service = await servicesCollection.findOne(query);
           res.json(service)
        })




        //get api

        app.get('/services', async(req, res)=> {
            const cursor = servicesCollection.find({})
            const services =  await cursor.toArray()
            res.send(services)
        })




        // post api
        app.post('/services', async(req, res)=> {
            const service = req.body
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)

        });
         //img post
         app.post('/images' , async(req, res)=> {
            const images = req.body;
            console.log('hit the post api',images)
            const result = await imagesCollection.insertOne(images)
            console.log(result)
            res.json('post hitted')

        })
        // get single img id
        app.get('/images/:id', async(req, res)=> {
            const id = req.params.id
            console.log('geitting specific images', id)
            const query = {_id : ObjectId(id)}
            const images = await imagesCollection.findOne(query)
            res.json(images)
        })
    // get img
    app.get('/images', async(req, res)=> {
        const cursor = imagesCollection.find({})
        const images = await cursor.toArray()
        res.send(images)
    })

    //get vehicles
    app.post('/vehicles', async(req, res)=>{
        const vehicles = req.body;
        console.log('hit the vehicles post api', vehicles)
        const result = await vehicleCollection.insertOne(vehicles)
        console.log(result)
        res.send('post hitted')
    })
    //get slected vehicles
    app.get('/vehicles/:id', async(req, res)=> {
        const id = req.params.id
        console.log('getting specific vehicls', id)
        const query = { _id : ObjectId(id)}
        const vehisles = await vehicleCollection.findOne(query)
        res.json(vehisles)
    })



    // get vehicles
    app.get('/vehicles', async(req, res)=> {
        const cursor = vehicleCollection.find({})
        const vehicles = await cursor.toArray()
        res.send(vehicles)
    })

    // get api
    app.get('/users' , async(req, res )=> {
        const cursor = userCollection.find({})
        const users = await cursor.toArray()
        res.send(users)
    })
    // users post api
    app.post('/users', async(req , res)=> {
        const newUser = req.body
        const result = await userCollection.insertOne(newUser)
       
        res.json(result)
    })

    //delete api
    app.delete('/users/:id' , async(req, res)=> {
        const id = req.params.id
        const query ={_id:ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.json(result)
    })
    // update api
    app.get('/user/:id', async(req, res)=> {
        const id = req.params.id
        const query = {_id: ObjectId(id)}
        const user = await userCollection.find(query)
        console.log('load user with id : ' , id)
        res.send(user)
    })
    
    }
    finally{
        // await client.close()
    }

}

run().catch(console.dir);




app.get('/', (req, res)=> {
    res.send('tourism server is running');
})


app.listen(port, () => {
    console.log('Server running at port')
})