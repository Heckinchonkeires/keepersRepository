const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: String,
  descriptions: [{
    type: String,
    default: ''
  }],
  elements: [String],
  isActive: {
    type: Boolean,
    default: false
  },
  manaCosts: [Number],
  iconImage: {
    type: Buffer,
    default: ''
  },
  iconImageType: {
    type: String,
    default: ''
  }
})

skillSchema.virtual('iconImagePath').get(function() {
  if (this.iconImage != null && this.iconImageType != null) {
    return `data:${this.iconImageType};charset=utf-8;base64,${this.iconImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Skill', skillSchema)