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
  iconImage: {
    type: Buffer,
    default: ''
  },
  iconImageType: {
    type: String,
    default: ''
  },
  isRare: {
    type: Boolean,
    required: true,
    default: false
  },
  atkBonuses: {
    type: [Number],
    default: null
  },
  magBonuses: {
    type: [Number],
    default: null
  },
  defBonuses: {
    type: [Number],
    default: null
  },
  healthBonuses: {
    type: [Number],
    default: null
  },
  manaBonuses: {
    type: [Number],
    default: null
  },
  manaRegenBonuses: {
    type: [Number],
    default: null
  },
  ccBonuses: {
    type: [Number],
    default: null
  },
  cdBonuses: {
    type: [Number],
    default: null
  },
  otherBonus: String,
  otherBonusValues: {
    type: [Number],
    default: null
  }
})

gearSchema.virtual('iconImagePath').get(function() {
  if (this.iconImage != null && this.iconImageType != null) {
    return `data:${this.iconImageType};charset=utf-8;base64,${this.iconImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Gear', gearSchema)