if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')

// Get Routers
const indexRouter = require('./routes/index')
const monsterRouter = require('./routes/monsters')
const buildRouter = require('./routes/builds')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false}));
app.use(express.static(path.join(__dirname, "public")))

//Connect to a mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Use Routers
app.use('/', indexRouter)
app.use('/monsters', monsterRouter)
app.use('/builds', buildRouter)

app.listen(process.env.PORT || 3000)