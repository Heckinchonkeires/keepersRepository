const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	res.render('monsters/index')
})

router.get('/new', async (req, res) => {
	res.render('monsters/new')
})

module.exports = router