const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favouriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//function
function renderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {

    //console.log(item)

    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img class="card-img-top"
              src="${POSTER_URL + item.image}"
              alt="movie poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer text-center">
                <button class="btn btn-primary btn-show-movie" 
                  data-toggle="modal"
                  data-id="${item.id}"
                  data-target="#movie-modal">More</button>
                <button class="btn btn-danger btn-remove-favourite" data-id='${item.id}'>X</button>
              </div>
          </div>
          </div>
        </div>
    `

  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release Date : ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `
    <img
                src="${POSTER_URL + data.image}"
                alt="movie-poster" class='img-fluid'>
                `
  })
}

function removeFromFavourite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)

  localStorage.setItem('favouriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault();
  //console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase()

  let filteredMovies = []

  if (!keyword.length) {
    return alert('Please enter a valid keyword')
  }

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  if (filteredMovies.length === 0) {
    return alert('No movie found with keyword: ' + keyword)
  }

  renderMovieList(filteredMovies)
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    //console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favourite')) {
    removeFromFavourite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)

window.addEventListener('storage', function (event) {
  movies = JSON.parse(event.newValue)
  renderMovieList(movies)
}) 