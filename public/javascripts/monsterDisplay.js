addGlobalEventListener('click', '.skill-checkbox', e => {
  const previousSkills = e.target.parentElement.parentElement.previousElementSibling?.children
  const preReqs = Array.from(e.target.dataset.prereqs.replace(',', ''))
  let havePreReqs = previousSkills == undefined || preReqs.length == 0
  preReqs.forEach(pr => {
    if (previousSkills[pr]?.querySelector('.skill-checkbox').checked) {
      havePreReqs = true
    }
  })
  if (havePreReqs == true) {
    let img = e.target.previousElementSibling
    img.style.opacity = e.target.checked ? '1' : '0.5'
  } else {
    e.target.checked = false
  }
})