addGlobalEventListener('click', '.skill-checkbox', e => {
  if (e.target.checked) {
    if (hasPreReqs(e.target)) {
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

function toggleSkillImage(checkbox) {
  let img = checkbox.previousElementSibling
  img.style.opacity = checkbox.checked ? '1' : '0.5'
}

function hasPreReqs(checkbox) {
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