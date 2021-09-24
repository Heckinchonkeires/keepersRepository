let currentSkillPoints = parseInt(document.querySelector('#level-number').value) + 2
let level = parseInt(document.querySelector('#level-number').value)

//toggle skill checkbox if appropriate
addGlobalEventListener('click', '.skill-checkbox', e => {
  if (e.target.checked) {
    if (havePreReqs(e.target) && !atMaxSkills()) {
      toggleSkillImage(e.target)
      currentSkillPoints--
      updateSkillPointTotal()
    } else {
      e.target.checked = false
    }
  } else {
    if (!isPreReq(e.target)) {
      toggleSkillImage(e.target)
      currentSkillPoints++
      updateSkillPointTotal()
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

//update shift description to match current selection
addGlobalEventListener( 'change', '.select-shift', e => {
  const passiveDescriptions = document.querySelectorAll('.shift-passive-description')
  passiveDescriptions.forEach(description => {
    description.style.display = 'none'
  })
  if (e.target.options[e.target.selectedIndex].className === 'option-shift-passive-light') {
    document.querySelector('.shift-passive-description-light').style.display = 'inherit'
    document.querySelector('#monsterShift').value = 'light'
  }
  if (e.target.options[e.target.selectedIndex].className === 'option-shift-passive-dark') {
    document.querySelector('.shift-passive-description-dark').style.display = 'inherit'
    document.querySelector('#monsterShift').value = 'dark'
  }
  if (e.target.options[e.target.selectedIndex].className === '') {
    document.querySelector('.shift-passive-description').style.display = 'inherit'
    document.querySelector('#monsterShift').value = 'none'
  }
})

//update weapon image to match current selection
addGlobalEventListener( 'change', '.select-weapon', e => {
  const weaponImages = document.querySelectorAll('.weapon-icon-img')
  const weaponName = e.target.value
  weaponImages.forEach(img => {
    if (img.alt == weaponName) {
      img.parentElement.style.display = 'inherit'
    } else {
      img.parentElement.style.display = 'none'
    }
  })
})

//update accesory images to match current selection
addGlobalEventListener('change', '.select-accessory', e => {
  const accessoryImages = e.target.parentElement.parentElement.querySelectorAll('.accessory-icon-img')
  const accessoryName = e.target.value
  accessoryImages.forEach(img => {
    if (img.alt == accessoryName) {
      img.parentElement.style.display = 'inherit'
    } else {
      img.parentElement.style.display = 'none'
    }
  })
})

addGlobalEventListener('change', '#level-number', e => {
  const nextLevel = parseInt(e.target.value)
  if (nextLevel > 0) {
    currentSkillPoints = currentSkillPoints + (nextLevel - level)
    updateSkillPointTotal()
    level = e.target.value
  }
})

addGlobalEventListener('click', '#is-starter', e => {
  if (e.target.checked) {
    currentSkillPoints++
  } else {
    currentSkillPoints--
  }
  updateSkillPointTotal()
})

addGlobalEventListener('click', '#skill-potion', e => {
  if (e.target.checked) {
    currentSkillPoints++
  } else {
    currentSkillPoints--
  }
  updateSkillPointTotal()
})

//validate the form
addGlobalEventListener('submit', '.build-container', e => {
  //Make sure accessories are unique
  let accessoryInputs = Array.from(document.querySelectorAll('.select-accessory'))
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

  //Make sure the build name isn't too long
  if (document.querySelector('#build-name').value.length > 40) {
    e.preventDefault()
    alert('Build name is too long')
    return
  }
})

function hasDuplicates(array) {
  const unique = array.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
  return unique.length !== array.length
}

function updateSkillPointTotal() {
  let totalContainer = document.querySelector('.skill-points-total-container')
  totalContainer.innerText = currentSkillPoints
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