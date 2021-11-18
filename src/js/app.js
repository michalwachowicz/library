const newBookBtn = document.querySelector('#btn-new')
const newBookForm = document.querySelector('.new-book__form')
const newBookSection = document.querySelector('.new-book')
const cancelBtn = document.querySelector('#btn-cancel')

const inputs = {
  name: document.querySelector('#book-name'),
  author: document.querySelector('#book-author'),
  pages: document.querySelector('#book-pages'),
  read: document.querySelector('#book-read'),
}

const booksElement = document.querySelector('.books')
const booksTableBody = booksElement.querySelector('.books__table__body')

const contextMenu = document.querySelector('.context-menu')
const deleteBtn = contextMenu.querySelector('#btn-delete')
const changeBtn = contextMenu.querySelector('#btn-change')

let lastId = 0
let myLibrary = []

function Book(name, author, pages, read) {
  this.id = ++lastId
  this.name = name
  this.author = author
  this.pages = pages
  this.read = read
}

Book.prototype.addBookToLibrary = function () {
  const row = createTableRow(this)

  for (let prop in this) {
    if (this.hasOwnProperty(prop) && prop != 'id') {
      const text = prop != 'read' ? this[prop] : this[prop] ? 'Yes' : 'No'
      const cell = createTableCell(text)

      row.appendChild(cell)
    }
  }

  booksTableBody.appendChild(row)
  myLibrary.push(this)

  toggleBooksVisibility()
}

function loadLocalStorageData() {
  if (localStorage.lastId) lastId = +localStorage.lastId
  else localStorage.lastId = lastId

  if (!localStorage.myLibrary) {
    localStorage.myLibrary = JSON.stringify([])
    return
  }

  for (let obj of JSON.parse(localStorage.myLibrary)) {
    const book = new Book(obj.name, obj.author, obj.pages, obj.read)
    book.addBookToLibrary()
  }
}

function openContextMenu(e, id) {
  contextMenu.classList.remove('hidden')
  contextMenu.style.top = `${e.clientY}px`
  contextMenu.style.left = `${e.clientX}px`
  contextMenu.setAttribute('data-book-id', id)
}

function toggleBooksVisibility() {
  if (booksTableBody.childElementCount > 0) {
    booksElement.classList.remove('hidden')
  } else {
    booksElement.classList.add('hidden')
  }
}

function createTableRow({ id }) {
  const row = document.createElement('tr')
  let timer

  row.classList.add('books__table__row')
  row.setAttribute('data-book-id', id)

  row.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    openContextMenu(e, id)
  })
  row.addEventListener('mousedown', (e) => {
    e.preventDefault()
    timer = setTimeout(() => {
      openContextMenu(e, id)
    }, 750)
  })
  row.addEventListener('mouseup', (e) => {
    e.preventDefault()
    if (timer) clearTimeout(timer)
  })

  return row
}

function createTableCell(text) {
  const cell = document.createElement('td')
  cell.classList.add('books__table__cell')
  cell.textContent = text
  return cell
}

function findTableRowByBookId(id) {
  return Array.from(document.querySelectorAll('.books__table__row')).find(
    (row) => row.getAttribute('data-book-id') == id
  )
}

function updateLocalStorageLibrary() {
  localStorage.myLibrary = JSON.stringify(
    myLibrary.map((b) => {
      return { name: b.name, author: b.author, pages: b.pages, read: b.read }
    })
  )
}

newBookBtn.addEventListener('click', () => {
  newBookSection.classList.toggle('hidden')
})

newBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const book = new Book(
    inputs.name.value,
    inputs.author.value,
    +inputs.pages.value,
    inputs.read.checked
  )
  book.addBookToLibrary()

  for (let input in inputs) {
    if (input == 'read') {
      inputs[input].checked = false
    } else {
      inputs[input].value = ''
    }
  }

  newBookSection.classList.add('hidden')

  localStorage.lastId = lastId
  updateLocalStorageLibrary()
})

deleteBtn.addEventListener('click', () => {
  contextMenu.classList.add('hidden')

  const id = contextMenu.getAttribute('data-book-id')
  if (!id) return

  const bookIndex = myLibrary.findIndex((b) => b.id == id)
  if (bookIndex != -1) {
    myLibrary.splice(bookIndex, 1)
    updateLocalStorageLibrary()
  }

  const element = findTableRowByBookId(id)
  if (element) {
    booksTableBody.removeChild(element)
    toggleBooksVisibility()
  }
})

changeBtn.addEventListener('click', () => {
  contextMenu.classList.add('hidden')

  const id = contextMenu.getAttribute('data-book-id')
  if (!id) return

  const book = myLibrary.find((b) => b.id == id)
  if (!book) return

  book.read = !book.read
  updateLocalStorageLibrary()

  const element = findTableRowByBookId(id)
  if (!element) return

  element.children[element.children.length - 1].textContent = book.read
    ? 'Yes'
    : 'No'
})

cancelBtn.addEventListener('click', () => {
  newBookSection.classList.add('hidden')
})

document.addEventListener('mousedown', (e) => {
  e.preventDefault()
  if (e.target != contextMenu && !contextMenu.contains(e.target)) {
    contextMenu.classList.add('hidden')
  }
})

loadLocalStorageData()
