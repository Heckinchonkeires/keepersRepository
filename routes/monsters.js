const express = require('express')
const router = express.Router()
const fs = require('fs')
const Monster = require('../models/monster')
const Gear = require('../models/gear')
const Food = require('../models/food')

//Monsters Index Route
router.get('/', async (req, res) => {
	res.render('monsters/index')
})

//New Monster Route
router.get('/new', async (req, res) => {
	try {
		const mon = await Monster.findOne({ name: req.query.monster })
		const weaponList = await Gear.find({ isWeapon: true })
		const accessoryList = await Gear.find({ isWeapon: false })
		const foodList = await Food.find()
		res.render('monsters/new', { monster: mon, weapons: weaponList, accessories: accessoryList, food: foodList })
	} catch (err) {
		console.log(err)
	}
})

//Create Monster Route
router.get('/create', async (req, res) => {
	res.render('monsters/create')
})

//POST Monster Route
router.post('/create', async (req, res) => {
	const monName = req.body.monster.toLowerCase()
	let mon = new Monster(JSON.parse(fs.readFileSync(`monsterJSONs/${monName}.json`)))
	try {
		await mon.save()
		res.render('monsters/create', { errorMessage: `Made ${monName}` })
	} catch (err) {
		console.error(err)
		res.render('monsters/create', { errorMessage: `Didn't make ${monName}` })
	}
})

//Individual Monster Route
router.get('/:monsterName', async (req, res) => {
	let mon
	try {
		mon = await Monster.findOne({ name: req.params.monsterName })
		res.render('monsters/show', { monster: mon })
	} catch (err) {
		console.log(err)
	}
})

module.exports = router