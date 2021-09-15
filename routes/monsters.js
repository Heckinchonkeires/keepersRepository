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

//New Monster Routes
router.get('/new', async (req, res) => {
	try {
		const mon = await Monster.findOne({ name: req.query.monster })
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
																					path: 'trees.skills.skill',
																					model: 'Skill'
																				}
																			})
		const weaponList = await Gear.find({ isWeapon: true })
		const accessoryList = await Gear.find({ isWeapon: false })
		const foodList = await Food.find()
		res.render('monsters/new', { monster: mon, weapons: weaponList, accessories: accessoryList, food: foodList })
	} catch (err) {
		console.log(err)
	}
})
router.post('/new', (req, res) => {
	console.log(req.body)
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
																	path: 'trees.skills.skill',
																	model: 'Skill'
																}
															})
		res.render('monsters/show', { monster: mon })
	} catch (err) {
		console.log(err)
	}
})

module.exports = router