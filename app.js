const express = require('express')
const session = require('express-session')
const connectDB = require('./db/connect')
const MongoDBSession = require('connect-mongodb-session')(session)
require('dotenv').config()
const app = express()


app.use(express.static('./public'))

const store = new MongoDBSession({
    uri: process.env.MONGO_URI,
    databaseName: 'Sessions',
    collection: 'mySessions'
})

app.use(session({
    secret: 'Some key signing cookie',
    resave: false,
    saveUninitialized: false,
    store: store
}))


app.get('/',(req,res)=>{
    req.session.isAuth = true  
    console.log(req.session)
    res.send('Hello')
})

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(5000, ()=>{
            console.log('server is live')
        })
    }catch(err){
        console.log(err)
    }
}

start()


