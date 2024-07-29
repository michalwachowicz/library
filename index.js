const bookContainer = document.querySelector(".book-container");
const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const createElement = (type, text, ...classList) => {
  const element = document.createElement(type);

  if (classList.length > 0) {
    classList
      .filter((className) => className)
      .forEach((className) => element.classList.add(className));
  }
  if (text) element.textContent = text;

  return element;
};

const createImage = (src, alt, width, height, ...classList) => {
  const img = createElement("img", null, classList);

  img.src = src;
  img.alt = alt;
  img.width = width;
  img.height = height;

  return img;
};

const createButton = (title) => {
  const btn = createElement("button", null, "btn", "btn-book");

  btn.type = "button";
  btn.title = title;

  return btn;
};

const renderBook = ({ title, author, read }) => {
  const book = createElement("div", null, "book");
  const bookCover = createElement("div", null, "book-cover");
  const bookCoverText = createElement("div", null, "book-cover-text");
  const bookTitle = createElement("h2", title, "book-title");
  const bookAuthor = createElement("div", author, "book-author");

  bookCoverText.append(bookTitle, bookAuthor);
  bookCover.appendChild(bookCoverText);

  const bookCoverImg = createImage(
    "./resources/img/book-cover.jpg",
    `${title}'s book cover`,
    600,
    900,
    "book-cover-img"
  );

  bookCover.appendChild(bookCoverImg);
  book.appendChild(bookCover);

  const bookDetails = createElement("div", null, "book-details");
  const bookRead = createElement(
    "div",
    "READ",
    "book-read",
    read ? "" : "hidden"
  );

  bookDetails.appendChild(bookRead);

  const bookControls = createElement("div", null, "book-controls");
  const readBtn = createButton(read ? "Unread" : "Read");
  const readIcon = createImage(
    `./resources/icons/${read ? "unread" : "read"}.svg`,
    `Book ${read ? "unread" : "read"} icon`,
    100,
    100,
    "icon"
  );

  readBtn.appendChild(readIcon);
  bookControls.appendChild(readBtn);

  const editBtn = createButton("Edit");
  const editIcon = createImage(
    "./resources/icons/edit.svg",
    "Book edit icon",
    100,
    100,
    "icon"
  );

  editBtn.appendChild(editIcon);
  bookControls.appendChild(editBtn);

  const deleteBtn = createButton("Delete");
  const deleteIcon = createImage(
    "./resources/icons/delete.svg",
    "Book delete icon",
    100,
    100,
    "icon"
  );

  deleteBtn.appendChild(deleteIcon);
  bookControls.appendChild(deleteBtn);
  bookDetails.appendChild(bookControls);
  book.appendChild(bookDetails);

  bookContainer.appendChild(book);
};

const renderBooks = () => {
  while (bookContainer.firstChild) {
    bookContainer.removeChild(bookContainer.lastChild);
  }

  myLibrary.forEach(renderBook);
};

Book.prototype.addToLibrary = function () {
  myLibrary.push(this);
  renderBooks();
};
