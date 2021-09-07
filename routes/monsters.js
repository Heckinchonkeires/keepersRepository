const express = require('express')
const router = express.Router()
const fs = require('fs')
const Monster = require('../models/monster')

//Monsters Index Route
router.get('/', async (req, res) => {
	let blob
	try {
		blob = await Monster.findOne({ name: 'Blob' })

		res.render('monsters/index', { monster: blob })
	} catch {
		blob = null
	}
})

//New Monster Route
router.get('/new', async (req, res) => {
	res.render('monsters/new')
})

//Create Monster Route
router.post('/', async (req, res) => {
	let blob = new Monster(JSON.parse(fs.readFileSync('monsterJSONs/blob.json')))
	try {
		await blob.save()
		res.send('Made blob')
	} catch (err) {
		console.error(err)
		res.send('Failed to make blob')
	}
})

module.exports = router