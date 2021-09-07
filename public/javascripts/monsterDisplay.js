addGlobalEventListener('click', '.skill-checkbox', e => {
  let img = e.target.previousElementSibling
  img.style.opacity = e.target.checked ? '1' : '0.5'
})