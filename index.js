const bookContainer = document.querySelector(".book-container");
const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const renderBooks = () => {
  while (bookContainer.firstChild) {
    bookContainer.removeChild(bookContainer.lastChild);
  }
};

Book.prototype.addToLibrary = function () {
  myLibrary.push(this);
  renderBooks();
};
