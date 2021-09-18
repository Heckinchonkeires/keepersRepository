const mongoose = require('mongoose')

const gearSchema = new mongoose.Schema({
  gear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gear',
    required: true
  },
  level: Number
})

const monsterBuildSchema = new mongoose.Schema({
  for: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
  shift: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 40
  },
  food: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  }],
  weapons: [gearSchema],
  accessories: [gearSchema],
  skills: [[[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Skill',
    required: true
  }]]]
})

module.exports = mongoose.model('MonsterBuild', monsterBuildSchema)