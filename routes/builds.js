const express = require('express')
const router = express.Router()
const xssFilters = require('xss-filters')
const Build = require('../models/monsterBuild')
const Gear = require('../models/gear')
const Food = require('../models/food')
const Skill = require('../models/skill')
const Monster = require('../models/monster')

//Builds Index Route
router.get('/', async (req, res) => {
	//find the 10 most recent builds
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

//New Build Routes
router.get('/new', async (req, res) => {
	if (req.query.monster != null) {
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
																						path: 'trees.skill',
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
			res.render('builds/new', { monster: mon, build: null, weapons: weaponList, accessories: accessoryList, food: foodList })
		} catch (err) {
			console.log(err)
		}
	} else {
		try {
			const monsterNames = await Monster.find({}, 'name -_id')
			let monsterNamesArray = []
			monsterNames.forEach(name => {
				monsterNamesArray.push(name.name)
			})
			monsterNamesArray.sort()
			res.render('builds/new', {monster: null, monsterNames: monsterNamesArray})
		} catch (err) {
			console.error(err)
		}
	}
})

router.post('/new', async (req, res) => {
	let newBuild = new Build({ 
		for: req.body.monsterName,
		name: xssFilters.inHTMLData(req.body.buildName),
		shift: req.body.shiftSelect,
		level: req.body.levelNumber,
		skillPotion: req.body.skillPotion === 'on',
		isStarter: req.body.isStarter === 'on'
	})

	try {
		let food = []
		//most of the time all 3 food items will be the same, so we check for that to save querying the database multiple times
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
					} else {
						newBuild.skills[treeNum][levelNum].push(null)
					}
				}
			}
		}

		for (let i = 0; i < 3; i++) {
			if (req.body[`ultimate${i}`] !== undefined) {
				newBuild.ultimate = i
			}
		}

		if (req.body.monsterShift === 'none') {
			newBuild.spriteImage = monster.spriteImage
			newBuild.spriteImageType = monster.spriteImageType
		}
		if (req.body.monsterShift === 'light') {
			newBuild.spriteImage = monster.spriteImageLight
			newBuild.spriteImageType = monster.spriteImageLightType
		}
		if (req.body.monsterShift === 'dark') {
			newBuild.spriteImage = monster.spriteImageDark
			newBuild.spriteImageType = monster.spriteImageDarkType
		}
		await newBuild.save()
	} catch (err) {
		console.error(err)
	}
	res.redirect(newBuild._id)
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
		let mon = null
		if (build != null) {
			mon = await Monster.findOne({ name: build.for })
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
		} else {
			console.log(build)
		}
		res.render('builds/show', { monster: mon, build: build })
	} catch (err) {
		console.error(err)
	}
})

router.get('/:id/edit', async (req, res) => {
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
																						path: 'trees.skill',
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
			res.render('builds/edit', { monster: mon, build: build, weapons: weaponList, accessories: accessoryList, food: foodList })
		} else {
			res.render('builds', { errorMessage: 'No build with that id', builds: null })
		}
	} catch (err) {
		console.log(err)
		res.render('builds', { errorMessage: 'Error', builds: null })
	}
})

router.post('/:id/edit', async (req, res) => {
	let build
	try {
		build = await Build.findOne({ _id: req.params.id })
	} catch (err) {
		console.error(err)
		build = null
	}
	build.name = xssFilters.inHTMLData(req.body.buildName)
	build.shift = req.body.shiftSelect
	build.level = req.body.levelNumber,
	build.skillPotion = req.body.skillPotion === 'on'
	build.isStarter = req.body.isStarter === 'on'

	try {
		let food = []
		//most of the time all 3 food items will be the same, so we check for that to save querying the database multiple times
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
		build.food = food

		//will need to adjust this to allow for multiple weapons later
		const weapon = await Gear.findOne({ name: req.body.weaponSelect })
		const weaponArray = [{gear: weapon._id, level: req.body.weaponLevel}]
		build.weapons = weaponArray

		//will need to adjust this to allow for more than 3 accessories later
		let accessoryArray = []
		for (let i = 1; i < 4; i++) {
			const accessory = await Gear.findOne({ name: req.body[`accessorySelect${i}`] })
			accessoryArray.push({gear: accessory._id, level: req.body[`accessory${i}Level`]})
		}
		build.accessories = accessoryArray

		let skillsArray = []
		const monster = await Monster.findOne({ name: req.body.monsterName })
		for (let treeNum = 0; treeNum < monster.skills.trees.length; treeNum++) {
			skillsArray.push([])
			for (let levelNum = 0; levelNum < monster.skills.trees[treeNum].skills.length; levelNum++) {
				skillsArray[treeNum].push([])
				for(let skillNum = 0; skillNum < monster.skills.trees[treeNum].skills[levelNum].length; skillNum++) {
					if (req.body[`skill${treeNum}${levelNum}${skillNum}`] !== undefined) {
						skillsArray[treeNum][levelNum].push(monster.skills.trees[treeNum].skills[levelNum][skillNum].skill)
					} else {
						skillsArray[treeNum][levelNum].push(null)
					}
				}
			}
		}
		build.skills = skillsArray

		for (let i = 0; i < 3; i++) {
			if (req.body[`ultimate${i}`] !== undefined) {
				build.ultimate = i
			}
		}

		if (req.body.monsterShift === 'none') {
			build.spriteImage = monster.spriteImage
			build.spriteImageType = monster.spriteImageType
		}
		if (req.body.monsterShift === 'light') {
			build.spriteImage = monster.spriteImageLight
			build.spriteImageType = monster.spriteImageLightType
		}
		if (req.body.monsterShift === 'dark') {
			build.spriteImage = monster.spriteImageDark
			build.spriteImageType = monster.spriteImageDarkType
		}
		await build.save()
	} catch (err) {
		console.error(err)
	}
	res.redirect('/')
})

module.exports = router