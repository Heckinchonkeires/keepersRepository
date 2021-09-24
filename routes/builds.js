const express = require('express')
const router = express.Router()
const Build = require('../models/monsterBuild')
const Gear = require('../models/gear')
const Food = require('../models/food')
const Skill = require('../models/skill')
const Monster = require('../models/monster')

router.get('/', async (req, res) => {
	const builds = await Build.find({}).sort({createdAt: -1})
																		.limit(10)
																		.populate('food')
																		.populate({ path: 'weapons',
																								populate: {
																									path: 'gear',
																									model: 'Gear'
																								}
																							})
																		.populate({ path: 'accessories',
																								populate: {
																									path: 'gear',
																									model: 'Gear'
																								}
																							})
	res.render('builds/index', { builds: builds })
})

router.get('/:id', async (req, res) => {
  try {
    const build = await Build.findOne({ _id: req.params.id })
															.populate('food')
															.populate({ path: 'skills', model: 'Skill'})
															.populate({ path: 'weapons',
																populate: {
																	path: 'gear',
																	model: 'Gear'
																}
															})
															.populate({ path: 'accessories',
																populate: {
																	path: 'gear',
																	model: 'Gear'
																}
															})
		if (build != null) {
			const mon = await Monster.findOne({ name: build.for })
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
			res.render('builds/show', { monster: mon, build: build, weapons: weaponList, accessories: accessoryList, food: foodList })
		} else {
			res.render('builds', { errorMessage: 'No build with that id', builds: null })
		}
	} catch (err) {
		console.log(err)
		res.render('builds', { errorMessage: 'Error', builds: null })
	}
})

module.exports = router