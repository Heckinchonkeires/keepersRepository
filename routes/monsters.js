const express = require('express')
const router = express.Router()
const Monster = require('../models/monster')
const Gear = require('../models/gear')
const Food = require('../models/food')
const Skill = require('../models/skill')
const MonsterBuild = require('../models/monsterBuild')

//Monsters Index Route
router.get('/', async (req, res) => {
	try {
		const monsterNames = await Monster.find({}, 'name -_id')
		let monsterNamesArray = []
		monsterNames.forEach(name => {
			monsterNamesArray.push(name.name)
		})
		monsterNamesArray.sort()
		res.render('monsters/index', {monsterNames: monsterNamesArray})
	} catch (err) {
		console.error(err)
	}
})

//Individual Monster Route
router.get('/:monsterName', async (req, res) => {
	let mon
	try {
		mon = await Monster.findOne({ name: req.params.monsterName })
											.populate({
																path: 'skills',
																populate: {
																	path: 'ultimates.skill',
																	model: 'Skill'
																}
															})
											.populate({
																path: 'skills',
																populate: {
																	path: 'trees.skill',
																	model: 'Skill'
																}
															})
		res.render('monsters/show', { monster: mon })
	} catch (err) {
		console.log(err)
	}
})

module.exports = router