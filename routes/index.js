const express = require('express')
const router = express.Router()
const Skill = require('../models/skill')

router.get('/', async (req, res) => {
	let skills = null
	const searchTerm = 'heaLth'
	try {
		skills = await Skill.find({ name: { $regex: searchTerm, $options: 'i' } })
	} catch (err) {
		console.error(err)
	}
	res.render('index', { skills: skills })
})

module.exports = router