const express = require('express')
const router = express.Router()
const Build = require('../models/monsterBuild')
const Gear = require('../models/gear')

router.get('/', async (req, res) => {
	const builds = await Build.find({}).sort({createdAt: -1})
																		.limit(5)
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
	res.render('index', { builds: builds })
})

module.exports = router