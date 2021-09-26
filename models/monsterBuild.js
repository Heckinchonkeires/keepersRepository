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
  spriteImage: {
    type: Buffer,
    default: ''
  },
  spriteImageType: {
    type: String,
    default: ''
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
    ref: 'Skill'
  }]]],
  //The index of the selected ultimate
  ultimate: {
    type: Number,
    min: 0,
    max: 2
  },
  skillPotion: {
   type: Boolean,
   required: true,
   default: true
  },
  isStarter: {
    type: Boolean,
    required: true,
    default: false
   }
})

monsterBuildSchema.virtual('spriteImagePath').get(function() {
  if (this.spriteImage != null && this.spriteImageType != null) {
    return `data:${this.spriteImageType};charset=utf-8;base64,${this.spriteImage.toString('base64')}`
  }
})

module.exports = mongoose.model('MonsterBuild', monsterBuildSchema)