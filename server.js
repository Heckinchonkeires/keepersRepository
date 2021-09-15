if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')

// Get Routers
const indexRouter = require('./routes/index')
const teamRouter = require('./routes/teams')
const monsterRouter = require('./routes/monsters')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false}));
app.use(express.static(path.join(__dirname, "public")))

//Temporary
const fs = require('fs')
const Monster = require('./models/monster')
const Gear = require('./models/gear')
const Food = require('./models/food')
const Skill = require('./models/skill')

//Connect to a mongoDB
const mongoose = require('mongoose')
const monster = require('./models/monster')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Use Routers
app.use('/', indexRouter)
app.use('/teams', teamRouter)
app.use('/monsters', monsterRouter)

//Temporary routes for initializing the database
app.get('/initialize', (req, res) => {
	res.render('initialize')
})

app.post('/initialize/gear', (req, res) => {
	db.collections['gears'].drop( err => {
		console.log('Dropped gear')
	})
	const fileNames = fs.readdirSync('gearJSONs')
	let success = true
	fileNames.forEach(async file => {
		let gear = new Gear(JSON.parse(fs.readFileSync(`gearJSONs/${file}`)))
		try {
			await gear.save()
			success = true
		} catch (err) {
			success = false
			console.error(err)
		}
	})
	res.render('initialize', { 
		errorMessage: success ? 'Initialized gear' : 'Failed initializing gear' 
	})
})

app.post('/initialize/food', async (req, res) => {
	db.collections['foods'].drop( err => {
		console.log('Dropped food')
	})
	const food = JSON.parse(fs.readFileSync('food.json'))
	let success = true
	for (let f in food) {
		let newFood = new Food(food[f])
		try {
			await newFood.save()
		} catch (err) {
			success = false
			console.error(err)
		}
	}
	res.render('initialize', { 
		errorMessage: success ? 'Initialized food' : 'Failed initializing food' 
	})
})

app.post('/initialize/skills', async (req, res) => {
	db.collections['skills'].drop( err => {
		console.log('Dropped skills')
	})
	const skills = JSON.parse(fs.readFileSync('skills.json'))
	let success = true
	for (let s in skills) {
		let skill = skills[s]
		skill.iconImageType = 'image/png'
		skill.iconImage = new Buffer.from((fs.readFileSync(`public/images/skills/${skill.name.replace(/ /g, '').toLowerCase()}.png`)))
		const newSkill = new Skill(skill)
		try {
			await newSkill.save()
		} catch (err) {
			success = false
			console.error(err)
		}
	}
	res.render('initialize', { 
		errorMessage: success ? 'Initialized skills' : 'Failed initializing skills' 
	})
})

app.post('/initialize/monsters', (req, res) => {
	db.collections['monsters'].drop( err => {
		console.log('Dropped monsters')
	})
	const fileNames = fs.readdirSync('monsterJSONs')
	let success = true
	fileNames.forEach(async file => {
		let monster = JSON.parse(fs.readFileSync(`monsterJSONs/${file}`))
		try {
			//loop through every skill
			for (let treeNum = 0; treeNum < monster.skills.trees.length; treeNum++) {
				for (let levelNum = 0; levelNum < monster.skills.trees[treeNum].skills.length; levelNum++) {
					for(let skillNum = 0; skillNum < monster.skills.trees[treeNum].skills[levelNum].length; skillNum++) {
						//link each skill with the right entry in the database
						monster.skills.trees[treeNum].skills[levelNum][skillNum].skill = await Skill.findOne({ name: monster.skills.trees[treeNum].skills[levelNum][skillNum].name })
					}
				}
			}
			//do the same for ultimates
			for (let i = 0; i < monster.skills.ultimates.length; i++) {
				monster.skills.ultimates[i].skill = await Skill.findOne({ name: monster.skills.ultimates[i].name })
			}
			newMonster = new Monster(monster)
			await newMonster.save()
		} catch (err) {
			success = false
			console.error(err)
		}
	})
	res.render('initialize', { 
		errorMessage: success ? 'Initialized monsters' : 'Failed initializing monsters' 
	})
})

app.listen(process.env.PORT || 3000)