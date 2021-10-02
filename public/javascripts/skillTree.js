const firstSkillImage = document.querySelector('.skill-img')
let levelNumberDiv = firstSkillImage.parentElement.querySelector('.skill-level-number')
let currentSkillName = firstSkillImage.alt
if (levelNumberDiv != null) {
  currentSkillName = currentSkillName + levelNumberDiv.innerText
}

addGlobalEventListener('mouseover', '.skill', e => {
  updateSkillDescription(e.target.querySelector('.skill-img'))
})

addGlobalEventListener('click', '.skill', e => {
  updateSkillDescription(e.target.querySelector('.skill-img'))
})

addGlobalEventListener('mouseover', '.skill-level-number', e => {
  updateSkillDescription(e.target.parentElement.querySelector('.skill-img'))
})

addGlobalEventListener('click', '.skill-level-number', e => {
  updateSkillDescription(e.target.parentElement.querySelector('.skill-img'))
})

addGlobalEventListener('mouseover', '.skill-img', e => {
  updateSkillDescription(e.target)
})

addGlobalEventListener('mouseover', '.skill-checkbox', e => {
  updateSkillDescription(e.target.previousElementSibling)
})

addGlobalEventListener('click', '.skill-checkbox', e => {
  updateSkillDescription(e.target.previousElementSibling)
})

addGlobalEventListener('mouseover', '.skill-checkbox-ultimate', e => {
  updateSkillDescription(e.target.previousElementSibling)
})

addGlobalEventListener('click', '.skill-checkbox-ultimate', e => {
  updateSkillDescription(e.target.previousElementSibling)
})

//changes the currently displayed skill description to the description matching the given skill image
function updateSkillDescription(skillImage) {
  let currentSkillDescription = document.querySelector(`#${currentSkillName.replace(/ /g, '_')}`)
  let nextSkillName = skillImage.alt.replace(/ /g, '_')
  const levelDiv = skillImage.parentElement.querySelector('.skill-level-number')
  if (levelDiv != null) {
    nextSkillName = nextSkillName + levelDiv.innerText
  }
  let nextSkillDescription = document.querySelector(`#${nextSkillName}`)
  currentSkillDescription.style.display = 'none'
  nextSkillDescription.style.display = 'flex'
  currentSkillName = nextSkillDescription.id
}