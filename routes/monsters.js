const express = require('express')
const router = express.Router()
const fs = require('fs')
const Monster = require('../models/monster')
const Gear = require('../models/gear')
const Food = require('../models/food')
const MonsterBuild = require('../models/monsterBuild')

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
		let weaponList = await Gear.find({ isWeapon: true })
		weaponList.sort((a, b) => {
			if (a.name < b.name) {
				return -1
			}
			if (a.name > b.name) {
				return 1
			}
			return 0
		})
		let accessoryList = await Gear.find({ isWeapon: false })
		accessoryList.sort((a, b) => {
			if (a.name < b.name) {
				return -1
			}
			if (a.name > b.name) {
				return 1
			}
			return 0
		})
		const foodList = await Food.find()
		res.render('monsters/new', { monster: mon, weapons: weaponList, accessories: accessoryList, food: foodList })
	} catch (err) {
		console.log(err)
	}
})

router.post('/new', async (req, res) => {
	console.log(req.body)
	let newBuild = new MonsterBuild({ 
		for: req.body.monsterName,
		shift: req.body.shiftSelect,
		level: req.body.levelNumber
	})
	try {
		let food = []
		//most of the time all 3 food items will be the same, so we check for that to avoid querying the database multiple times
		if (req.body.foodSelect1 === req.body.foodSelect2 && req.body.foodSelect2 === req.body.foodSelect3) {
			const selectedFood = await Food.findOne({ name: req.body.foodSelect1 })
			for (let i = 0; i < 3; i++) {
				food.push(selectedFood._id)
			}
		} else {
			for (let i = 1; i < 4; i++) {
				const selectedFood = await Food.findOne({ name: req.body[`foodSelect${i}`] })
				food.push(selectedFood._id)
			}
		}
		newBuild.food = food
		//will need to adjust this to allow for multiple weapons later
		const weapon = await Gear.findOne({ name: req.body.weaponSelect })
		newBuild.weapons.push({gear: weapon._id, level: req.body.weaponLevel})
		//will need to adjust this to allow for more than 3 accessories later
		for (let i = 1; i < 4; i++) {
			const accessory = await Gear.findOne({ name: req.body[`accessorySelect${i}`] })
			newBuild.accessories.push({gear: accessory._id, level: req.body[`accessory${i}Level`]})
		}
		const monster = await Monster.findOne({ name: req.body.monsterName })
		for (let treeNum = 0; treeNum < monster.skills.trees.length; treeNum++) {
			newBuild.skills.push([])
			for (let levelNum = 0; levelNum < monster.skills.trees[treeNum].skills.length; levelNum++) {
				newBuild.skills[treeNum].push([])
				for(let skillNum = 0; skillNum < monster.skills.trees[treeNum].skills[levelNum].length; skillNum++) {
					if (req.body[`skill${treeNum}${levelNum}${skillNum}`] !== undefined) {
						newBuild.skills[treeNum][levelNum].push(monster.skills.trees[treeNum].skills[levelNum][skillNum].skill)
					}
				}
			}
		}
		// console.log(newBuild)
		// await newBuild.save()
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