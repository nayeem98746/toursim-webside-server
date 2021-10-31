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




            //img post
            app.post('/images' , async(req, res)=> {
              console.log('hit the post image') 
                // const result = await imagesCollection.insertOne(image)
                // console.log(result)
                res.send('post hitet')

            })


        // get img
        app.get('/images', async(req, res)=> {
            const cursor = imagesCollection.find({})
            const images = await cursor.toArray()
            res.send(images)
        })

        });
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