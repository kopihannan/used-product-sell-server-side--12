const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const UserCollection = client.db('categories').collection('users')

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

app.post('/categories', async (req, res) => {
    try {
        const products = req.body;
        const result = await ProductsCollection.insertOne(products).toArray()
        res.send(result)
    } catch (error) {

    }
})

app.post('/user', async (req, res) => {
    try {
        const users = req.body;
        const result = await UserCollection.insertOne(users)
        res.send(result)
    } catch (error) {

    }
})

app.get('/user', async (req, res) => {
    try {
        const query = {};
        const result = await UserCollection.find(query).toArray();
        res.send(result);

    } catch (error) {

    }
})

app.get('/user/admin/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email }
        const user = await UserCollection.findOne(query);
        res.send({ isAdmin: user?.role === 'admin' });

    } catch (error) {

    }
})

app.delete('/user/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        const result = await UserCollection.deleteOne(filter);
        res.send(result)

    } catch (error) {
        
    }
})

app.get('/', (res, req) => {
    req.send(`${port} Quicker Server is runnig`)
})

app.listen(port, () => {
    console.log(`server is now runnig ${port}`);
})