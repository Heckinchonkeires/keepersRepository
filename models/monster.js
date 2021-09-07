
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
  }
})

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
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: this.isActive
  },
  preReqs: {
    type: [Number],
    default: null
  }
})

const skillTreeSchema = new mongoose.Schema({
  levelOne: {
    startSkills: {
      type: [skillSchema]
    },
    skills: [skillSchema]
  },
  levelTen: [skillSchema],
  levelTwenty: [skillSchema],
  levelThirty: [skillSchema]
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
  shiftPassiveLight: {
    type: shiftPassiveSchema,
    required: true
  },
  shiftPassiveDark: {
    type: shiftPassiveSchema,
    required: true
  },
  skills: {
    type: skillsSchema,
    required: true
  }
})

monsterSchema.methods.getSkillList = function() {
  let result = []
  this.skills.trees.forEach(tree => {
    tree.levelOne.startSkills.forEach(skill => {
      result.push(skill.name)
    }) 
    tree.levelOne.skills.forEach(skill => {
      result.push(skill.name)
    })
    tree.levelTen.forEach(skill => {
      result.push(skill.name)
    })
    tree.levelTwenty.forEach(skill => {
      result.push(skill.name)
    })
    tree.levelThirty.forEach(skill => {
      result.push(skill.name)
    })
  })
  this.skills.ultimates.forEach(skill => {
    result.push(skill.name)
  })
  return result
}

module.exports = mongoose.model('Monster', monsterSchema)