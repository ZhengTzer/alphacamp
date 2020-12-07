//api
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

//variable
let userData = []
let selectedGender = []
let submitGender = 'female'
let motoInput = ''

//data
const dataPanel = document.getElementById('data-panel')
let filterGender = document.querySelector('#filter-gender')
let selectedLoved = document.getElementById('selectedLoved')
let lovedUser = JSON.parse(localStorage.getItem('favouriteUsers')) || []

//button
const clearButton = document.querySelector('#allEmpty-button');
const emailInput = document.querySelector('#emailResult')
const submitButton = document.querySelector("#finalSubmit");
let addFavourite = document.querySelectorAll('.card-body')

//preview area
let genderPreview = document.querySelector('#submitGender')
let motoPreview = document.querySelector('#moto')

//get data
axios.get(INDEX_URL).then((res) => {
  userData.push(...res.data.results)
  selectedGender = userData.filter((person) => person.gender === "female");
  renderUserList(selectedGender);
})

//base render user
function renderUserList(data) {
  let rawHTML = ''
  data.slice(0, 12).forEach(user => {
    rawHTML += `
      <div class="col-2 mb-2">
          <div class="card" id='clickSelection'>
              <img class="card-img-top rounded-circle" src="${user.avatar}" alt="user avatar">
              <!-- card body-->
              <div class="card-body text-center">
                <button type="button" class="btn btn-danger rounded-circle btn-add-favourite" data-id="${user.id}">
                LOVE
                </button>
              </div>
          </div>
          </div>
      </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

filterGender.addEventListener("click", function onClickGenderFilter(event) {
  if (event.target.matches("#filter-gender-male")) {
    selectedGender = userData.filter((person) => person.gender === "male");
    submitGender = document.querySelector('#filter-gender-male').innerText

  } else if (event.target.matches("#filter-gender-female")) {
    selectedGender = userData.filter((person) => person.gender === "female");
    submitGender = document.querySelector('#filter-gender-female').innerText

  } else {
    selectedGender = userData.filter((person) => person.gender === "female");
    submitGender = document.querySelector('#filter-gender-female').innerText
  }
  renderUserList(selectedGender);
  genderPreviewBeforeSubmit(submitGender)
});

//moto input
form.addEventListener('submit', (event) => {
  event.preventDefault()
  motoInput = input.value.toString()
  motoInputPreview()
})


//select love user
function addToFavourite(id) {
  const user = userData.find((user) => user.id === id)

  if (lovedUser.some((user) => user.id === id)) {
    return alert('已選擇!')
  }
  lovedUser.push(user)
  localStorage.setItem('favouriteUsers', JSON.stringify(lovedUser))

}

dataPanel.addEventListener('click', function onClickedLove(event) {
  if (event.target.matches('.btn-add-favourite')) {
    addToFavourite(Number(event.target.dataset.id))
    selectedLovedPreview(lovedUser)
    //console.log('click!')
  }
})

function selectedLovedPreview(data) {
  let rawHTML = ''

  data.forEach((user) => {
    rawHTML += `
    <img class="rounded-circle" src="${user.avatar}" alt = "user avatar">
    `
  })

  selectedLoved.innerHTML = rawHTML
}

//preview table
function genderPreviewBeforeSubmit() {
  genderPreview.innerText = submitGender
}

function motoInputPreview() {
  motoPreview.innerText = motoInput
}

//submit button
submitButton.addEventListener("click", submit)
function submit() {
  let keyword = emailInput.value
  if (!keyword.length) {
    return alert('Please enter a valid email')
  } else alert('以發出，請耐心等候')
  reset()
}

//reset button
function resetMoto() {
  document.getElementById("input").value = '';
}

function reset() {
  localStorage.removeItem('favouriteUsers')
  genderPreview.innerText = ''
  motoPreview.innerText = ''
  lovedUser = []
  while (selectedLoved.firstChild) {
    selectedLoved.removeChild(selectedLoved.firstChild)
  }
}

clearButton.addEventListener("click", reset)

