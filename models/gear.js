const mongoose = require('mongoose')


const gearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isWeapon: {
    type: Boolean,
    required: true,
    default: false
  },
  isRare: {
    type: Boolean,
    required: true,
    default: false
  },
  atkBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  magBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  defBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  healthBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  manaBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  manaRegenBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  ccBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  cdBonuses: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  },
  otherBonus: String,
  otherBonusValues: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0],
    validate: function(v) {
      return v.length === 6
    }
  }
})

module.exports = mongoose.model('Gear', gearSchema)