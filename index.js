const newDialogBtn = document.querySelector("#btn-new");
const cancelDialogBtns = document.querySelectorAll(".btn-cancel");

const addEditDialog = document.querySelector("#add-edit-dialog");
const addEditForm = document.querySelector("#add-edit-form");

const addEditTitle = document.querySelector("#add-edit-title");
const addEditConfirm = document.querySelector("#btn-add-edit-confirm");

const deleteDialog = document.querySelector("#delete-dialog");
const deleteForm = document.querySelector("#delete-form");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const readInput = document.querySelector("#read");

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

const createButton = (title, ...classList) => {
  const btn = createElement("button", null, "btn", "btn-book", classList);

  btn.type = "button";
  btn.title = title;

  return btn;
};

const renderBook = ({ title, author, read }, index) => {
  const book = createElement("div", null, "book");
  book.dataset.index = index;

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
  const readBtn = createButton(read ? "Unread" : "Read", "btn-read");
  const readIcon = createImage(
    `./resources/icons/${read ? "unread" : "read"}.svg`,
    `Book ${read ? "unread" : "read"} icon`,
    100,
    100,
    "icon"
  );

  readBtn.appendChild(readIcon);
  bookControls.appendChild(readBtn);

  const editBtn = createButton("Edit", "btn-edit");
  const editIcon = createImage(
    "./resources/icons/edit.svg",
    "Book edit icon",
    100,
    100,
    "icon"
  );

  editBtn.appendChild(editIcon);
  bookControls.appendChild(editBtn);

  const deleteBtn = createButton("Delete", "btn-delete");
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

  myLibrary.forEach((book, index) => renderBook(book, index));
};

Book.prototype.addToLibrary = function () {
  myLibrary.push(this);
  renderBooks();
};

const findElement = (path, filter) => {
  for (let element of path) {
    if (element instanceof HTMLElement && filter(element)) return element;
  }
  return null;
};

const findDialog = (path) =>
  findElement(path, (element) => element.tagName.toLowerCase() === "dialog");

const findBook = (path) =>
  findElement(path, (element) => element.classList.contains("book"));

const setInputValues = (title, author, pages, read) => {
  titleInput.value = title;
  authorInput.value = author;
  pagesInput.value = pages;
  readInput.checked = read;
};

const showAddEditDialog = (index, title, submitText) => {
  addEditDialog.showModal();
  addEditDialog.dataset.index = index;

  addEditTitle.textContent = title;
  addEditConfirm.textContent = submitText;
};

newDialogBtn.addEventListener("click", () => {
  showAddEditDialog(-1, "Add a new book", "Add");
});

cancelDialogBtns.forEach((cancelBtn) =>
  cancelBtn.addEventListener("click", (e) => {
    let dialog = findDialog(e.composedPath());
    if (dialog) dialog.close();
  })
);

addEditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const book = new Book(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    readInput.checked
  );
  const index = addEditDialog.dataset.index;

  setInputValues("", "", "", false);
  addEditDialog.close();

  if (index < 0) {
    book.addToLibrary();
    return;
  }

  myLibrary[index] = book;
  renderBooks();
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const index = deleteDialog.dataset.index;
  myLibrary.splice(index, 1);

  renderBooks();
  deleteDialog.close();
});

bookContainer.addEventListener("click", (e) => {
  let target = e.target;

  if (
    target.classList.contains("icon") &&
    target.parentNode.classList.contains("btn")
  ) {
    target = target.parentNode;
  }

  const classList = target.classList;
  if (!classList.contains("btn")) return;

  const bookElement = findBook(e.composedPath());
  const bookIndex = bookElement.dataset.index;

  if (classList.contains("btn-read")) {
    myLibrary[bookIndex].read = !myLibrary[bookIndex].read;
    renderBooks();
    return;
  }

  if (classList.contains("btn-edit")) {
    showAddEditDialog(bookIndex, "Edit the selected book", "Edit");

    const { title, author, pages, read } = myLibrary[bookIndex];
    setInputValues(title, author, pages, read);

    return;
  }

  if (classList.contains("btn-delete")) {
    deleteDialog.dataset.index = bookIndex;
    deleteDialog.showModal();
  }
});
