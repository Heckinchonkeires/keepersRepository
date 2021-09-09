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
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false}));
app.use(express.static(path.join(__dirname, '/public')))

//Temporary
const fs = require('fs')
const Gear = require('./models/gear')
const Food = require('./models/food')

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

//Temporary routes for adding gear and food
app.get('/createGear', (req, res) => {
	res.render('createGear')
})
app.post('/createGear', async (req, res) => {
	const gearName = req.body.gear.toLowerCase()
	let gear = new Gear(JSON.parse(fs.readFileSync(`gearJSONs/${gearName}.json`)))
	try {
		await gear.save()
		res.render('createGear', { errorMessage: `Created ${gearName}` })
	} catch (err) {
		console.error(err)
		res.render('createGear', { errorMessage: `Failed to create ${gearName}` })
	}
})
app.post('/createFood', async (req, res) => {
	let food = JSON.parse(fs.readFileSync('food.json'))
	for (let f in food) {
		let newFood = new Food(food[f])
		try {
			await newFood.save()
		} catch (err) {
			console.error(err)
			res.send('Failed to create food')
		}
	}
	res.send('Created food')
})

app.listen(process.env.PORT || 3000)