let currentSkillName = document.querySelector('.skill-img').alt

addGlobalEventListener('mouseover', '.skill-img', e => {
  updateSkillDescription(e.target.alt)
})

addGlobalEventListener('mouseover', '.skill-checkbox', e => {
  updateSkillDescription(e.target.previousElementSibling.alt)
})

addGlobalEventListener('click', '.skill-checkbox', e => {
  updateSkillDescription(e.target.previousElementSibling.alt)
})

addGlobalEventListener('mouseover', '.skill-checkbox-ultimate', e => {
  updateSkillDescription(e.target.previousElementSibling.alt)
})

addGlobalEventListener('click', '.skill-checkbox-ultimate', e => {
  updateSkillDescription(e.target.previousElementSibling.alt)
})

//changes the currently displayed skill description to the description of the skill with the given name
function updateSkillDescription(skillName) {
  let currentSkillDescription = document.querySelector(`#${currentSkillName.replace(/ /g, '_')}`)
  let nextSkillDescription = document.querySelector(`#${skillName.replace(/ /g, '_')}`)
  currentSkillDescription.style.display = 'none'
  nextSkillDescription.style.display = 'flex'
  currentSkillName = nextSkillDescription.id
}