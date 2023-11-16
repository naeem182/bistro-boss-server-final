const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.il0t7ji.mongodb.net`;

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();

        /* --------------------------------
         *      NAMING CONVENTION
         * --------------------------------
         * app.get('/users')
         * app.get('/users/:id')
         * app.post('/users')
         * app.put('/users/:id')
         * app.patch('/users/:id')
         * app.delete('/users/:id')
         * 
        */


        const menuCollection = client.db("bistroDB").collection("menu");
        const reviewCollection = client.db("bistroDB").collection("reviews");
        const cartCollection = client.db("bistroDB").collection("carts");

        // carts collection
        app.post('/carts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem);
            res.send(result);
        })
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };

            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })




        app.get('/menucount', async (req, res) => {
            const count = await menuCollection.estimatedDocumentCount();
            res.send({ count });
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure that the client will close when you finish/error
        // Commented out for now, but you might need to uncomment it in production
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("bistro boss is running");
});

app.listen(port, () => {
    console.log(`bistro boss server is running on port: ${port}`);
});
