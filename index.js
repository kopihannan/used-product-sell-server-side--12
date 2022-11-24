const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.risshmy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("Connected Mongodb");
    }
    catch (error) {

    }
}

run().catch(console.dir);

const CategroiesCollection = client.db('categories').collection('services')
const ProductsCollection = client.db('categories').collection('products')

app.get('/categories', async (req, res) => {
    try {
        const query = {};
        const result = await CategroiesCollection.find(query).toArray();
        res.send(result);

    } catch (error) {

    }
})

app.get('/categories/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const query = { category };
        const products = await ProductsCollection.find(query).toArray();
        res.send(products)


    } catch (error) {

    }
})



app.get('/', (res, req) => {
    req.send(`${port} Quicker Server is runnig`)
})

app.listen(port, () => {
    console.log(`server is now runnig ${port}`);
})