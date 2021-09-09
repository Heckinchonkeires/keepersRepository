const express = require('express')
const router = express.Router()
const Monster = require('../models/monster')

router.get('/', async (req, res) => {
	res.render('index')
})

module.exports = router