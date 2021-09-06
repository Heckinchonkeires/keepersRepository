const express = require('express')
const router = express.Router()
const Monster = require('../models/monster')

router.get('/', async (req, res) => {
	let blob
	try {
		blob = await Monster.findOne({ name : 'Blob' })
		console.log(`Found monster ${blob.name}`)
	} catch {
		blob = null
	}
	res.render('index', { monster: blob })
})

module.exports = router