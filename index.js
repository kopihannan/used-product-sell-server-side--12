const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 6000;

const app = express();
app.use(cors());
app.use(express.json());





app.get('/', (res, req) => {
    req.send(`${port} Quicker Server is runnig`)
})

app.listen(port, () => {
    console.log(`server is now runnig ${port}`);
})