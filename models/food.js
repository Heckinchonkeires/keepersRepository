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
  value: Number
})

module.exports = mongoose.model('Food',foodSchema)