const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const layoutToggle = document.querySelector('#layout-toggle')

//default render setting
let displayType = 'card'
let currentPage = 1

const MOVIES_PER_PAGE = 12
const pagination = document.querySelector('#paginator')

//initial render
axios.get(INDEX_URL).then((res) => {
  movies.push(...res.data.results)
  renderPaginator(movies.length)
  displayDataList()
})
  .catch((err) => console.log(err))


//event
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault();
  //console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('Please enter a valid keyword')
  }
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert('No movie found with keyword: ' + keyword)
  }
  displayDataList()
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favourite')) {
    addToFavourite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //not clicked on <a></a>
  if (event.target.tagName !== 'A') return

  currentPage = Number(event.target.dataset.page)
  displayDataList()
})

layoutToggle.addEventListener('click', function onDisplayToggleClicked(event) {
  if (event.target.matches('#layout-toggle-card')) {
    displayType = 'card'
  } else if (event.target.matches('#layout-toggle-list')) {
    displayType = 'list'
  }
  //console.log(displayType)
  displayDataList()
})

//function
function displayDataList() {
  const movieList = getMoviesByPage(currentPage)
  displayType === 'card' ? renderMovieListCard(movieList) : renderMovieListList(movieList)
}

function addToFavourite(id) {
  function isMovieIdMatched(movie) {
    return movie.id === id
  }
  const list = JSON.parse(localStorage.getItem('favouriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('已收藏!')
  }
  list.push(movie)
  localStorage.setItem('favouriteMovies', JSON.stringify(list))
}


//render movie : card
function renderMovieListCard(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favourite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

//render movie : list
function renderMovieListList(data) {
  let rawHTML = ''
  rawHTML += '<table class="table"><tbody>'
  data.forEach(item => {
    rawHTML += `
        <tr>
          <td>
              <h5 class="card-title">${item.title}</h5>
          </td>
          <td>
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </td>
        </tr>
    `
  })
  rawHTML += '</tbody></table>'
  dataPanel.innerHTML = rawHTML
}


function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ``

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  // if filteredMovies got value, return filteredMovies; else return movies
  const data = filteredMovies.length ? filteredMovies : movies

  // page 1 -> movies 0 - 11
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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
    <img src="${POSTER_URL + data.image}" alt="movie-poster" class='img-fluid'>
    `
  })
}

