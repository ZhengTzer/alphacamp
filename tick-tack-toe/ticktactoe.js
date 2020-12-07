const table = document.querySelector('#app table')
let clickedTime = 0

function draw(cell) {
  if (clickedTime % 2 == 0) {
    cell.innerHTML = `<div class='circle'></div>`
  } else {
    cell.innerHTML = `<div class='cross'></div>`
  }
  clickedTime++
}

table.addEventListener('click', function onTableClicked(event) {
  if (event.target.tagName !== 'TD') return

  draw(event.target)
})