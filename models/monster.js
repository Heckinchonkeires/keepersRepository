const mongoose = require('mongoose')

const monsterTypes = ['Aerial', 'Aquatic', 'Beast', 'Bird', 'Construct', 'Dragon', 'Fish', 'Goblin', 'Insect', 'Mage', 'Nature', 'Occult', 'Reptile', 'Slime', 'Spirit', 'Warrior', 'Worm']
const elements = ['Debuff', 'Earth', 'Elemental Shift', 'Fire', 'Magic', 'Neutral', 'Physical', 'Water', 'Wind']

const shiftPassiveSchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
    default: ''
  },
  affectsStats: {
    type: Boolean,
    default: false
  },
  isLight: {
    type: Boolean,
    default: false
  }
})

const skillSchema = new mongoose.Schema({
  name: String,
  skill: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Skill'
  },
  preReqs: {
    type: [Number],
    default: null
  },
  level: {
    type: Number,
    min: 1,
    max: 5
  }
})

const skillTreeSchema = new mongoose.Schema({
  skills: [[skillSchema]]
})

const skillsSchema = new mongoose.Schema({
  trees: [skillTreeSchema],
  ultimates: [skillSchema]
})

const monsterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
  monsterTypes: {
    type: [String],
    required: true,
    validate: function(v) {
      for(let i = 0; i < v.length; i++) {
        if (!monsterTypes.includes(v[i])) {
          return false
        }
      }
      return true
    }
  },
  weaknesses: {
    type: [String],
    required: true,
    validate: function(v) {
      for(let i = 0; i < v.length; i++) {
        if (!elements.includes(v[i])) {
          return false
        }
      }
      return true
    }
  },
  resistances: {
    type: [String],
    required: true,
    validate: function(v) {
      for(let i = 0; i < v.length; i++) {
        if (!elements.includes(v[i])) {
          return false
        }
      }
      return true
    }
  },
  stats: {
    type: [Number],
    required: true,
    validate: function(v) {
      return v.length === 5
    }
  },
  shiftBonusLight: {
    type: [Number],
    required: true
  },
  shiftBonusDark: {
    type: [Number],
    required: true
  },
  shiftPassives: {
    type: [shiftPassiveSchema],
    required: true
  },
  spriteImage: {
    type: Buffer,
    default: ''
  },
  spriteImageType: {
    type: String,
    default: ''
  },
  spriteImageLight: {
    type: Buffer,
    default: ''
  },
  spriteImageLightType: {
    type: String,
    default: ''
  },
  spriteImageDark: {
    type: Buffer,
    default: ''
  },
  spriteImageDarkType: {
    type: String,
    default: ''
  },
  skills: {
    type: skillsSchema,
    required: true
  }
})

monsterSchema.virtual('spriteImagePath').get(function() {
  if (this.spriteImage != null && this.spriteImageType != null) {
    return `data:${this.spriteImageType};charset=utf-8;base64,${this.spriteImage.toString('base64')}`
  }
})

monsterSchema.virtual('spriteImageLightPath').get(function() {
  if (this.spriteImageLight != null && this.spriteImageLightType != null) {
    return `data:${this.spriteImageLightType};charset=utf-8;base64,${this.spriteImageLight.toString('base64')}`
  }
})

monsterSchema.virtual('spriteImageDarkPath').get(function() {
  if (this.spriteImageDark != null && this.spriteImageDarkType != null) {
    return `data:${this.spriteImageDarkType};charset=utf-8;base64,${this.spriteImageDark.toString('base64')}`
  }
})

monsterSchema.methods.getSkillList = function() {
  let result = []
  this.skills.trees.forEach(tree => {
    tree.skills.forEach(level => {
      level.forEach(skill => {
        result.push(skill)
      })
    })
  })
  this.skills.ultimates.forEach(skill => {
    result.push(skill)
  })
  result = [...new Set(result)]
  return result
}

module.exports = mongoose.model('Monster', monsterSchema)