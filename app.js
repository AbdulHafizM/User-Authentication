const express = require('express')
const session = require('express-session')
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const path = require('path')
const MongoDBSession = require('connect-mongodb-session')(session)
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

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

const store = new MongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'mySessions',
})

app.use(session({
    secret: 'Some key signing cookie',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.use('', authRouter)

const authenticate = (req,res,next) => {
    if(req.session.isAuth){
        next()
    }
    res.redirect('/login')
}

app.get('/', (req, res) => {
    res.render('pages/index')
})


app.get('/login',(req,res)=>{
    res.render('pages/login')
})

app.get('/register',(req,res)=>{
    res.render('pages/register')
})

app.get('/dashboard',authenticate,(req,res)=>{
    res.render('pages/dashboard')
})
