const mongoose = require('mongoose')
const statNames = ['def', 'health', 'mana', 'cd', 'dmg']


const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stat: {
    type: String,
    required: true,
    validate: function(v) {
      for(let i = 0; i < statNames.length; i++) {
        if (statNames[i] == v) {
          return true
        }
      }
      return false
    }
  },
  value: Number,
  iconImage: {
    type: Buffer,
    default: ''
  },
  iconImageType: {
    type: String,
    default: ''
  }
})

foodSchema.virtual('iconImagePath').get(function() {
  if (this.iconImage != null && this.iconImageType != null) {
    return `data:${this.iconImageType};charset=utf-8;base64,${this.iconImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Food',foodSchema)