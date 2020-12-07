const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const userData = []
const dataPanel = document.getElementById('data-panel')

function renderUserList(data) {
  let rawHTML = ''
  data.forEach(user => {
    rawHTML += `
    <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img class="card-img-top" src="${user.avatar}" alt="user avatar">
            <!--card body-->
            <div class="card-body">
              <h5 class="card-title">${user.name} ${user.surname}</h5>
            </div>
            <!-- card footer-->
            <div class="card-footer text-center">
              <button class='btn btn-primary btn-user-detail' data-toggle="modal"
                data-target="#user-modal" data-id='${user.id}'>Details</button>
            </div>
          </div>
        </div>
      </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

function showUserDetail(id) {
  const url = INDEX_URL + id

  const modalName = document.getElementById("user-modal-name");
  const modalAvatar = document.getElementById("user-modal-image");

  const modalAge = document.getElementById("user-modal-age");
  const modalBirthday = document.getElementById("user-modal-birthday");

  const modalGender = document.getElementById("user-modal-gender");
  const modalRegion = document.getElementById("user-modal-region");
  const modalEmail = document.getElementById("user-modal-email");

  axios.get(url).then((res) => {
    const data = res.data;

    modalName.innerText = `${data.name} ${data.surname}`;
    modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid">`;
    modalBirthday.textContent = `Birthday: ${data.birthday}`;
    modalAge.textContent = `Age: ${data.age}`;
    modalGender.textContent = `Gender: ${data.gender}`;
    modalRegion.textContent = `Region: ${data.region}`;
    modalEmail.textContent = `Email: ${data.email}`;
  })
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-user-detail')) {
    showUserDetail(Number(event.target.dataset.id))
  }
})

axios.get(INDEX_URL).then((res) => {
  userData.push(...res.data.results)
  renderUserList(userData)
})