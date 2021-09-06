const express = require('express')
const router = express.Router()
const Monster = require('../models/monster')

//Monsters Index Route
router.get('/', async (req, res) => {
	let blob
	try {
		blob = await Monster.findOne({ name : 'Blob' })
	} catch {
		blob = null
	}
	res.render('monsters/index', { monster: blob })
})

//New Monster Route
router.get('/new', async (req, res) => {
	res.render('monsters/new')
})

//Create Monster Route
router.post('/', async (req, res) => {
	let blob = new Monster({
		name: 'Blob',
		monsterTypes: ['Slime'],
		weaknesses: ['Wind'],
		resistances: ['Water'],
		stats: [2, 4, 2, 5, 6],
		shiftBonusLight: [1, 1, 1, 3, 1],
		shiftBonusDark: [1, 3, 0, 1, 3],
		shiftPassiveLight: {
			name: 'Heal Charging',
			description: 'All healing skills give the healed Monster a Charge stack for each heal. (Active and Passive)'
		},
		shiftPassiveDark: {
			name: 'Curse Chain',
			description: 'Whenever this Monster applies a Debuff to an enemy, 35% chance to spread it to another enemy.'
		},
		skills: {
			trees: [
				{
					levelOne: {
						startSkills: [{name: 'Acid Rain Level 1', isActive: true}],
						skills: [
							{name: 'Mana Upkeep'},
							{name: 'Acid Rain Level 2', isActive: true},
							{name: 'Health Plus'}
						]
					},
					levelTen: [
						{name: 'Mana Upkeep'},
						{name: 'Acid Rain Level 3', isActive: true},
						{name: 'Full Defense Level 1', isActive: true},
						{name: 'Defense Plus'}
					],
					levelTwenty: [
						{name: 'Multi Armor Break'},
						{name: 'Acid Rain Level 4', isActive: true},
						{name: 'Full Defense Level 2', isActive: true},
						{name: 'Defense Plus'}
					],
					levelThirty: [
						{name: 'Slime Infestation'},
						{name: 'Acid Rain Level 5', isActive: true},
						{name: 'Full Defense Level 3', isActive: true},
						{name: 'Supply'}
					]
				},
				{
					levelOne: {
						startSkills: [
							{name: 'Arcane Bolt Level 1', isActive: true},
							{name: 'Buble Burst Level 1', isActive: true}
						],
						skills: [
							{name: 'Magic Proc'},
							{name: 'Arcane Bolt Level 2', isActive: true},
							{name: 'Buble Burst Level 2', isActive: true},
							{name: 'Mana Plus'}
						]
					},
					levelTen: [
						{name: 'Magic Proc'},
						{name: 'Arcane Bolt Level 3', isActive: true},
						{name: 'Buble Burst Level 3', isActive: true},
						{name: 'Health Plus'}
					],
					levelTwenty: [
						{name: 'Health Proc'},
						{name: 'Arcane Bolt Level 4', isActive: true},
						{name: 'Buble Burst Level 4', isActive: true},
						{name: 'Combo Initiator'}
					],
					levelThirty: [
						{name: 'Weaken'},
						{name: 'Arcane Bolt Level 5', isActive: true},
						{name: 'Buble Burst Level 5', isActive: true},
						{name: 'Defense plus'}
					]
				},
				{
					levelOne: {
						startSkills: [{name: 'Heal Level 1', isActive: true}],
						skills: [
							{name: 'Magic Plus'},
							{name: 'Heal Level 2', isActive: true},
							{name: 'Combo Healing'}
						]
					},
					levelTen: [
						{name: 'Preparation'},
						{name: 'Heal Level 3', isActive: true},
						{name: 'Healing Wave Level 1', isActive: true},
						{name: 'Heal Mastery'}
					],
					levelTwenty: [
						{name: 'Magic Plus'},
						{name: 'Heal Level 4', isActive: true},
						{name: 'Healing Wave Level 2', isActive: true},
						{name: 'Healing Shield'}
					],
					levelThirty: [
						{name: 'Purify'},
						{name: 'Acid Rain Level 5', isActive: true},
						{name: 'Full Defense Level 3', isActive: true},
						{name: 'Transfusion'}
					]
				},
				{
					levelOne: {
						startSkills: [{name: 'Slime Shot Level 1', isActive: true}],
						skills: [
							{name: 'Defense Plus'},
							{name: 'Slime Shot Level 2', isActive: true},
							{name: 'Sorcery', isActive: true}
						]
					},
					levelTen: [
						{name: 'Hexing Support'},
						{name: 'Slime Shot Level 3', isActive: true},
						{name: 'Wizardry Level 1', isActive: true},
						{name: 'Health Focus'}
					],
					levelTwenty: [
						{name: 'Plague'},
						{name: 'Slime Shot Level 4', isActive: true},
						{name: 'Wizardry Level 2', isActive: true},
						{name: 'Defense Plus'}
					],
					levelThirty: [
						{name: 'Corrosion'},
						{name: 'Slime Shot Level 5', isActive: true},
						{name: 'Wizardry Level 3', isActive: true},
						{name: 'Buffing Heal'}
					]
				}
			],
			ultimates: [
				{name: 'Acid Hurricane', isActive: true},
				{name: 'Replenish', isActive: true},
				{name: 'Slime-aggedon', isActive: true},
			]
		}
	})

	try {
		await blob.save()
		res.send('Made blob')
	} catch (err) {
		console.error(err)
		res.send('Failed to make blob')
	}
})

module.exports = router