const express = require('express')
const router = express.Router()
const fs = require('fs')
const Monster = require('../models/monster')

//Monsters Index Route
router.get('/', async (req, res) => {
	res.render('monsters/index')
})

//New Monster Route
router.get('/new', async (req, res) => {
	res.render('monsters/new')
})

//Create Monster Route
router.post('/', async (req, res) => {
	let monName = req.body.monster.toLowerCase()
	let mon = new Monster(JSON.parse(fs.readFileSync(`monsterJSONs/${monName}.json`)))
	try {
		await mon.save()
		res.send(`Made ${monName}`)
	} catch (err) {
		console.error(err)
		res.send(`Failed to make ${monName}`)
	}
})

//Individual Monster Route
router.get('/:monsterName', async (req, res) => {
	let mon
	try {
		mon = await Monster.findOne({ name: req.params.monsterName })

		res.render('monsters/show', { monster: mon })
	} catch (err) {
		mon = null
		console.log(err)
	}
})

module.exports = router