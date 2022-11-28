const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
const BookingCollection = client.db('categories').collection('Booked')
const AdvertiseCollection = client.db('categories').collection('advertise')
const PaymentCollection = client.db('categories').collection('payment')

app.get('/categorie', async (req, res) => {
    try {
        const query = {};
        const result = await CategroiesCollection.find(query).toArray();
        res.send(result);

    } catch (error) {

    }
})

app.get('/categorie/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const query = { category };
        const products = await ProductsCollection.find(query).toArray();
        res.send(products)


    } catch (error) {

    }
})

app.put('/ads', async (req, res) => {
    try {
        const query = req.body;
        const option = { upsert: true };
        const updatedDoc = {
            $set: {
                isAdvirtise: true
            }
        }
        const result = await AdvertiseCollection.updateOne(query, updatedDoc, option);
        res.send(result);
    } catch (error) {

    }
})

app.get('/ads', async (req, res) => {
    try {
        const query = req.body;
        const result = await AdvertiseCollection.find(query).toArray()
        res.send(result)
    } catch (error) {

    }
})


app.get('/categorie/category/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email };
        const products = await ProductsCollection.find(query).toArray();
        res.send(products)
    } catch (error) {

    }
})



app.post('/categorie', async (req, res) => {
    try {
        const products = req.body;
        const result = await ProductsCollection.insertOne(products).toArray()
        res.send(result)
    } catch (error) {

    }
})

app.post('/booking', async (req, res) => {
    try {
        const booking = req.body;
        const query = {
            email: booking.email,
            price: booking.price,
            image: booking.image,
            userName: booking.userName,
            productName: booking.productName,
            phoneNumber: booking.phoneNumber,
            locationCustomer: booking.locationCustomer
        }

        const booked = await BookingCollection.find(query).toArray();

        if (booked.length) {
            const message = `You already have a booking on ${booking.email}`
            return res.send({ acknowledged: false, message })
        }

        const result = await BookingCollection.insertOne(booking);
        res.send(result);
    } catch (error) {

    }
});

app.get('/booking', async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const bookings = await BookingCollection.find(query).toArray();
    res.send(bookings);
});

app.get('/booking/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const booking = await BookingCollection.findOne(query);
    res.send(booking);
})

app.post('/create-payment-intent', async (req, res) => {
    const booking = req.body;
    const price = booking.price;
    const amount = price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
            "card"
        ]
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

app.post('/payments', async (req, res) => {
    const payment = req.body;
    const result = await PaymentCollection.insertOne(payment);
    const id = payment.bookingId
    const filter = { _id: ObjectId(id) }
    const updatedDoc = {
        $set: {
            paid: true,
            transactionId: payment.transactionId
        }
    }
    const updatedResult = await BookingCollection.updateOne(filter, updatedDoc)
    res.send(result);
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

app.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email }
        const user = await UserCollection.findOne(query);
        res.send({ isType: user?.select === 'seller', isVerify: user?.isVerified === 'verified' });

    } catch (error) {

    }
})



app.put('/user/admin/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const option = { upsert: true };
        const updatedDoc = {
            $set: {
                isVerified: 'verified'
            }
        }
        const result = await UserCollection.updateOne(query, updatedDoc, option);
        res.send(result);
    } catch (error) {

    }
})


app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const result = await UserCollection.deleteOne(filter);
        res.send(result)

    } catch (error) {

    }
})

app.delete('/categorie/category/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const result = await ProductsCollection.deleteOne(filter);
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