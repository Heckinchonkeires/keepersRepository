const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
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