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

let myLibrary = []

function Book(name, author, pages, read) {
  this.name = name
  this.author = author
  this.pages = pages
  this.read = read
}

Book.prototype.addBookToLibrary = function () {
  const row = createTableRow()

  for (let prop in this) {
    if (this.hasOwnProperty(prop)) {
      const text = prop != 'read' ? this[prop] : this[prop] ? 'Yes' : 'No'
      const cell = createTableCell(text)

      row.appendChild(cell)
    }
  }

  booksTableBody.appendChild(row)
  myLibrary.push(this)

  showBooks()
}

function showBooks() {
  if (booksTableBody.childElementCount > 0) {
    booksElement.classList.remove('hidden')
  }
}

function createTableRow() {
  const row = document.createElement('tr')

  row.classList.add('books__table__row')
  row.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    alert('You wanted to open context menu')
  })

  return row
}

function createTableCell(text) {
  const cell = document.createElement('td')
  cell.classList.add('books__table__cell')
  cell.textContent = text
  return cell
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
})

cancelBtn.addEventListener('click', () => {
  newBookSection.classList.add('hidden')
})
