if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const path = require('path')

// Get Routers
const indexRouter = require('./routes/index')
const teamRouter = require('./routes/teams')
const monsterRouter = require('./routes/monsters')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false}));
app.use(express.static(path.join(__dirname, '/public')))

//Connect to a mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Use Routers
app.use('/', indexRouter)
app.use('/teams', teamRouter)
app.use('/monsters', monsterRouter)

app.listen(process.env.PORT || 3000)