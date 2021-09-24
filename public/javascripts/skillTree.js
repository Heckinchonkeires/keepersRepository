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

function updateSkillDescription(skillName) {
  let currentSkillDescription = document.querySelector(`#${currentSkillName.replace(' ', '_')}`)
  let nextSkillDescription = document.querySelector(`#${skillName.replace(' ', '_')}`)
  currentSkillDescription.style.display = 'none'
  nextSkillDescription.style.display = 'flex'
  currentSkillName = nextSkillDescription.id
}