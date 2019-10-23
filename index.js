const express = require('express')
const bodyParser = require('body-parser')
const redisController = require('./controllers/redis')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/redis', redisController);


const MONGODB_HOST = '127.0.0.1'
const MONGODB_PORT = '27017'
const MONGODB_DATABASE = 'sme'
const MONGODB_USER = 'root'
const MONGODB_PASSWORD = 'example'

// Connect to MongoDB:
const uri = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
//const uri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
//const uri='mongodb://root:example@127.0.0.1:27017/admin'
mongoose.pluralize(null)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })


app.listen(port, function () {
    console.log("Server listen on port " + port);
});