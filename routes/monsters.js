const express = require('express')
const router = express.Router()

//Monsters Index Route
router.get('/', async (req, res) => {
	res.render('monsters/index')
})

//New Monster Route
router.get('/new', async (req, res) => {
	res.render('monsters/new')
})

//Create Monster Route
router.post('/', (req, res) => {
	res.send('Create monster')
})

module.exports = router