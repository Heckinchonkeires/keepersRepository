const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	res.render('teams/index')
})

router.get('/new', async (req, res) => {
	res.render('teams/new')
})


module.exports = router