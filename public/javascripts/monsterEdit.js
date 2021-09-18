addGlobalEventListener('click', '.skill-checkbox', e => {
  if (e.target.checked) {
    if (havePreReqs(e.target) && !atMaxSkills()) {
      toggleSkillImage(e.target)
    } else {
      e.target.checked = false
    }
  } else {
    if (!isPreReq(e.target)) {
      toggleSkillImage(e.target)
    } else {
      e.target.checked = true
    }
  }
})

addGlobalEventListener('click', '.skill-checkbox-ultimate', e => {
  if (e.target.checked) {
    if (!siblingsChecked(e.target)) {
      toggleSkillImage(e.target)
    } else {
      e.target.checked = false
    }
  } else {
    toggleSkillImage(e.target)
  }
})

addGlobalEventListener('submit', '.build-container', e => {
  //Make sure accessories are unique
  const accessoryInputs = Array.from(document.querySelectorAll('.select-accessory'))
  for (let i = 0; i < accessoryInputs.length; i++) {
    accessoryInputs[i] = accessoryInputs[i].options[accessoryInputs[i].selectedIndex].value
  }
  if(hasDuplicates(accessoryInputs)) {
    e.preventDefault()
    alert('Only one of each accessory')
    return
  }

  //Make sure there aren't more skills than skill points
  if(atMaxSkills()){
    e.preventDefault()
    alert('Not enough skill points')
    return
  }

  //Make sure the build has a name
  if (document.querySelector('#build-name').value === '') {
    e.preventDefault()
    alert('Please enter a build name')
    return
  }
})

addGlobalEventListener( 'change', '.select-shift', e => {
  const passiveDescriptions = document.querySelectorAll('.shift-passive-description')
  passiveDescriptions.forEach(description => {
    description.style.display === 'none' ? description.style.display = '' : description.style.display = 'none'
  })
})

function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

function toggleSkillImage(checkbox) {
  let img = checkbox.previousElementSibling
  img.style.opacity = checkbox.checked ? '1' : '0.5'
}

function havePreReqs(checkbox) {
    const previousSkills = checkbox.parentElement.parentElement.previousElementSibling?.children
    const preReqs = Array.from(checkbox.dataset.prereqs.replace(',', ''))
    let result = preReqs.length == 0
    preReqs.forEach(pr => {
      if (previousSkills[pr]?.querySelector('.skill-checkbox').checked) {
        result = true
      }
    })
    return result
}

function isPreReq(checkbox) {
  const nextSkills = Array.from(checkbox.parentElement.parentElement.nextElementSibling?.children || []) 
  const currentSkills = Array.from(checkbox.parentElement.parentElement.children)
  const currentIndex = currentSkills.indexOf(checkbox.parentElement)
  let result = false
  nextSkills.forEach(skill => {
    const checkbox = skill.querySelector('.skill-checkbox')
    const preReqs = Array.from(checkbox.dataset.prereqs.replace(',', ''))
    if (preReqs.includes(currentIndex.toString()) && checkbox.checked) {
      result = true
    }
  })
  return result
}

function siblingsChecked(checkbox) {
  const neighbors = Array.from(checkbox.parentElement.parentElement.children)
  const currentIndex = neighbors.indexOf(checkbox.parentElement)
  let result = false
  for (let i = 0; i < neighbors.length; i++) {
    if (i !== currentIndex) {
      const checkbox = neighbors[i].querySelector('.skill-checkbox-ultimate')
      if (checkbox.checked) result = true
    }
  }
  return result
}

function atMaxSkills() {
  const checkedSkills = document.querySelectorAll('.skill-checkbox:checked')
  let skillMax = document.querySelector('#level-number').value 
  if (document.querySelector('#skill-potion').checked) skillMax++
  if (document.querySelector('#is-starter').checked) skillMax++
  return checkedSkills.length > skillMax
}