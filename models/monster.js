
const mongoose = require('mongoose')

const monsterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
  monsterType: {
    type: String,
    enum: ['Aerial', 'Aquatic', 'Beast', 'Bird', 'Construct', 'Dragon', 'Fish', 'Goblin', 'Insect', 'Mage', 'Nature', 'Occult', 'Reptile', 'Slime', 'Spirit', 'Warrior', 'Worm'],
    required: true
  },
  defenseStrong: [String],
  defenseWeak: [String],
  stats: {
    attack: {
      type: Number,
      min: 1,
      max: 10
    },
    magic: {
      type: Number,
      min: 1,
      max: 10
    },
    defense: {
      type: Number,
      min: 1,
      max: 10
    },
    health: {
      type: Number,
      min: 1,
      max: 10
    },
    mana: {
      type: Number,
      min: 1,
      max: 10
    },
    required: true
  },
  shiftBonusLight: {
    type: [Number],
    required: true
  },
  shiftBonusDark: {
    type: [Number],
    required: true
  },

  //These need to be more than just strings.
  shiftPassiveLight: {
    type: String,
    required: true
  },
  shiftPassiveDark: {
    type: String,
    required: true
  },

  //This one's a doozy
  skillTree: {
    required: true
  }
})

module.exports = mongoose.model('Monster', monsterSchema)