addGlobalEventListener('click', '.skill-checkbox', e => {
  if (e.target.checked) {
    if (hasPreReqs(e.target)) {
      toggleSkillCheckbox(e.target)
    } else {
      e.target.checked = false
    }
  } else {
    if (!isPreReq(e.target)) {
      toggleSkillCheckbox(e.target)
    } else {
      e.target.checked = true
    }
  }
})

function toggleSkillCheckbox(checkbox) {
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
    const nextSkills = Array.from(checkbox.parentElement.parentElement.nextElementSibling?.children) || []
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