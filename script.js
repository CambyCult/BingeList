// Data Structures

class Show {
  constructor(
    title = 'Unknown',
    episodes = '0',
    isWatched = false
  ) {
    this.title = title
    this.episodes = episodes
    this.isWatched = isWatched
  }
}

class Library {
  constructor() {
    this.shows = []
  }

  addShow(newShow) {
    if (!this.isInLibrary(newShow)) {
      this.shows.push(newShow)
    }
  }

  removeShow(title) {
    this.shows = this.shows.filter((show) => show.title !== title)
  }

  getShow(title) {
    return this.shows.find((show) => show.title === title)
  }

  isInLibrary(newShow) {
    return this.shows.some((show) => show.title === newShow.title)
  }
}

const library = new Library()

// User Interface

const accountModal = document.getElementById('accountModal')
const addShowBtn = document.getElementById('addShowBtn')
const addShowModal = document.getElementById('addShowModal')
const errorMsg = document.getElementById('errorMsg')
const overlay = document.getElementById('overlay')
const addShowForm = document.getElementById('addShowForm')
const showsGrid = document.getElementById('showsGrid')
const loggedIn = document.getElementById('loggedIn')
const loggedOut = document.getElementById('loggedOut')
const loadingRing = document.getElementById('loadingRing')

const setupNavbar = (user) => {
  if (user) {
    loggedIn.classList.add('active')
    loggedOut.classList.remove('active')
  } else {
    loggedIn.classList.remove('active')
    loggedOut.classList.add('active')
  }
  loadingRing.classList.remove('active')
}

const setupAccountModal = (user) => {
  if (user) {
    accountModal.innerHTML = `
      <p>Logged in as</p>
      <p><strong>${user.email.split('@')[0]}</strong></p>`
  } else {
    accountModal.innerHTML = ''
  }
}

const openAddShowModal = () => {
  addShowForm.reset()
  addShowModal.classList.add('active')
  overlay.classList.add('active')
}

const closeAddShowModal = () => {
  addShowModal.classList.remove('active')
  overlay.classList.remove('active')
  errorMsg.classList.remove('active')
  errorMsg.textContent = ''
}

const openAccountModal = () => {
  accountModal.classList.add('active')
  overlay.classList.add('active')
}

const closeAccountModal = () => {
  accountModal.classList.remove('active')
  overlay.classList.remove('active')
}

const closeAllModals = () => {
  closeAddShowModal()
  closeAccountModal()
}

const handleKeyboardInput = (e) => {
  if (e.key === 'Escape') closeAllModals()
}

const updateShowsGrid = () => {
  resetShowsGrid()
  for (let show of library.shows) {
    createShowCard(show)
  }
}

const resetShowsGrid = () => {
  showsGrid.innerHTML = ''
}

const createShowCard = (show) => {
  const showCard = document.createElement('div')
  const title = document.createElement('h3')
  const episodes = document.createElement('h3')
  const watchedBtn = document.createElement('button')
  const removeBtn = document.createElement('button')

  showCard.classList.add('show-card')
  watchedBtn.classList.add('btn')
  removeBtn.classList.add('btn')
  removeBtn.classList.add('btn-red')
  watchedBtn.onclick = toggleWatched
  removeBtn.onclick = removeShow

  title.textContent = `"${show.title}"`
  episodes.textContent = `${show.episodes} episodes`
  removeBtn.textContent = 'Remove'

  if (show.isWatched) {
    watchedBtn.textContent = 'Watched'
    watchedBtn.classList.add('btn-light-green')
  } else {
    watchedBtn.textContent = 'Not watched'
    watchedBtn.classList.add('btn-light-red')
  }

  showCard.appendChild(title)
  showCard.appendChild(episodes)
  showCard.appendChild(watchedBtn)
  showCard.appendChild(removeBtn)
  showsGrid.appendChild(showCard)
}

const getShowFromInput = () => {
  const title = document.getElementById('title').value
  const episodes = document.getElementById('episodes').value
  const isWatched = document.getElementById('isWatched').checked
  return new Show(title, episodes, isWatched)
}

const addShow = (e) => {
  e.preventDefault()
  const newShow = getShowFromInput()

  if (library.isInLibrary(newShow)) {
    errorMsg.textContent = 'This show already exists in your catalogue'
    errorMsg.classList.add('active')
    return
  }

  
    library.addShow(newShow)
    saveLocal()
    updateShowsGrid()
  

  closeAddShowModal()
}

const removeShow = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', '')

  
    library.removeShow(title)
    saveLocal()
    updateShowsGrid()
  
}

const toggleWatched = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', '')
  const show = library.getShow(title)

  
    show.isWatched = !show.isWatched
    saveLocal()
    updateShowsGrid()
  
}


addShowBtn.onclick = openAddShowModal
overlay.onclick = closeAllModals
addShowForm.onsubmit = addShow
window.onkeydown = handleKeyboardInput

// Local Storage

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.shows))
}

const restoreLocal = () => {
  const shows = JSON.parse(localStorage.getItem('library'))
  if (shows) {
    library.shows = shows.map((show) => JSONToShow(show))
  } else {
    library.shows = []
  }
}

// Auth
// Firestore

// Utils

const docsToShows = (docs) => {
  return docs.map((doc) => {
    return new Show(
      doc.data().title,
      doc.data().episodes,
      doc.data().isWatched
    )
  })
}

const JSONToShow = (show) => {
  return new Show(show.title, show.episodes, show.isWatched)
}

const showToDoc = (show) => {
  return {
    title: show.title,
    episodes: show.episodes,
    isWatched: show.isWatched,
    
  }
}