let bookList = books;
//@ts-check

/**
 * @type {Array} bookList
 */
let matches = bookList;
let page = 1;
const BOOKS_PER_PAGE = 36; // I define the number of books per page

// Checking for a valid 'books' array
if (!books || !Array.isArray(books)) throw Error("Source required");

// I just defined the day and night objects
const css = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

// Initialize 'fragment' properly
const fragment = document.createDocumentFragment(); // An empty document fragment
// Extract the first batch of books to show
const extracted = books.slice(0, BOOKS_PER_PAGE);

// Encapsulated book preview abstraction
const bookPreview = {
  bookData: null,
  overlayDialog: document.querySelector("[data-list-active]"),

  /**
   * function to create a preview element for a book
   *
   * @param {{author, id, image, title, description, published}} bookData - A book data object for creating previews.
   * @returns {HTMLDivElement} the HTML div element that will be displayed when viewing a preview
   */
  create: function (bookData) {
    const previewElement = document.createElement("div");
    previewElement.classList.add("preview");

    const imageElement = document.createElement("img");
    imageElement.src = bookData.image;
    imageElement.alt = bookData.title;
    imageElement.classList.add("preview__image");
    previewElement.appendChild(imageElement);

    const infoElement = document.createElement("div");
    infoElement.classList.add("preview__info");

    const titleElement = document.createElement("h3");
    titleElement.textContent = bookData.title;
    titleElement.classList.add("preview__title");
    infoElement.appendChild(titleElement);

    const authorName = authors[bookData.author];
    if (authorName) {
      const authorElement = document.createElement("p");
      authorElement.textContent = `Author: ${authorName}`;
      authorElement.classList.add("preview__author");
      infoElement.appendChild(authorElement);
    }

    previewElement.appendChild(infoElement);
    return previewElement;
  },

  display: function (activeBook) {
    this.bookData = activeBook;
    const overlayTitle = this.overlayDialog.querySelector("[data-list-title]");
    const overlaySubtitle = this.overlayDialog.querySelector(
      "[data-list-subtitle]"
    );
    const overlayDescription = this.overlayDialog.querySelector(
      "[data-list-description]"
    );
    const overlayImage = this.overlayDialog.querySelector("[data-list-image]");
    const overlayBlur = this.overlayDialog.querySelector("[data-list-blur]");

    overlayTitle.textContent = this.bookData.title;
    overlaySubtitle.textContent = `Author: ${
      authors[this.bookData.author]
    } (${new Date(this.bookData.published).getFullYear()})`;
    overlayDescription.textContent = this.bookData.description;
    overlayImage.src = this.bookData.image;
    overlayImage.alt = this.bookData.title;
    overlayBlur.src = this.bookData.image;
    this.overlayDialog.open = true;
  },

  close: function () {
    this.overlayDialog.open = false;
  },
};

for (const { author, image, title, id, description, published } of extracted) {
  const preview = bookPreview.create({
    author,
    image,
    title,
    id,
    description,
    published,
  });
  preview.dataset.listPreview = id;
  fragment.appendChild(preview);
}

//got the data-list-item element
let dataListItems = document.querySelector("[data-list-items]");
// add the fragment
dataListItems.appendChild(fragment);

// initialize 'genres' properly
//document fragment for genres
const allGenres = document.createDocumentFragment();
const optionElement = document.createElement("option");
optionElement.value = "any";
optionElement.innerText = "All Genres";
//add 'all genres' to document
allGenres.appendChild(optionElement);

//loop through genres and create option elements
for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  allGenres.appendChild(element); //add option to document
}

//get the data-search-genres element
const dataSearchGenres = document.querySelector("[data-search-genres]");
dataSearchGenres.appendChild(allGenres);

// initialize 'authors' & create document fragment
const allAuthors = document.createDocumentFragment();
const authorElement = document.createElement("option");
authorElement.value = "any";
authorElement.innerText = "All Authors";
allAuthors.appendChild(authorElement);

// loop through authors
for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  allAuthors.appendChild(element);
}

// Assuming 'data-search-authors' is a DOM element
const dataSearchAuthors = document.querySelector("[data-search-authors]");
dataSearchAuthors.appendChild(allAuthors);

// initialize 'v' properly and set documentElement properties
const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const v = isDarkTheme ? "night" : "day";
//set css variables for selected themes
document.documentElement.style.setProperty("--color-dark", css[v].dark);
document.documentElement.style.setProperty("--color-light", css[v].light);

// Correct the assignment of 'data-list-button'
let dataListButton = document.querySelector("[data-list-button]");
dataListButton.textContent = `Show more (${
  matches.length - page * BOOKS_PER_PAGE > 0
    ? matches.length - page * BOOKS_PER_PAGE
    : 0
})`;

dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;

// Correct event listeners by adding 'function'
dataSearchCancel = document.querySelector("[data-search-cancel]");
dataSearchCancel.addEventListener("click", function () {
  const dataSearchOverlay = document.querySelector("[data-search-overlay]");
  dataSearchOverlay.open = false; //close search overlay when cancel is clicked
});
//get data-settings-cancel element
dataSettingsCancel = document.querySelector("[data-settings-cancel]");
dataSettingsCancel.addEventListener("click", function () {
  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  if (settingsOverlay) {
    settingsOverlay.open = false;
  }
});
//get element
dataSettingsForm = document.querySelector("[data-settings-form]");
dataSettingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(dataSettingsForm);

  for (const [name, value] of formData.entries()) {
    console.log(`${name}: ${value}`); // Log form field names and values
  }

  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  if (settingsOverlay) {
    settingsOverlay.open = false; //close settings overlay after submission
  }
});

// Close the book preview when the 'data-list-close' element is clicked
const dataListClose = document.querySelector("[data-list-close]");
dataListClose.addEventListener("click", () => bookPreview.close());

// Get the data-list-button element
dataListButton = document.querySelector("[data-list-button]");
dataListButton.addEventListener("click", function () {
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;

  // Get the books to display on the current page
  const nextPageItems = matches.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();
  // Create preview elements and add them to the fragment
  for (const {
    author,
    image,
    title,
    id,
    description,
    published,
  } of nextPageItems) {
    const preview = bookPreview.create({
      author,
      id,
      image,
      title,
      description,
      published,
    });

    // Set the 'data-list-preview' attribute
    preview.dataset.listPreview = id;
    fragment.appendChild(preview);
  }

  let dataListItems = document.querySelector("[data-list-items]");
  dataListItems.appendChild(fragment);

  page++;

  // Update the show more button based on remaining books
  dataListButton.textContent = `Show more (${
    matches.length - page * BOOKS_PER_PAGE > 0
      ? matches.length - page * BOOKS_PER_PAGE
      : 0
  })`;
  // Disable the button if there are no more books to show
  dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;
});

// Get data-header-search and data-search-overlay elements
dataHeaderSearch = document.querySelector("[data-header-search]");
dataHeaderSearch.addEventListener("click", function () {
  const dataSearchOverlay = document.querySelector("[data-search-overlay]");
  dataSearchOverlay.open = true;
  if (dataSearchOverlay.open === true) {
    const dataSearchTitle = document.querySelector("[data-search-title]");
    dataSearchTitle.focus();
  }
});

dataHeaderSettings = document.querySelector("[data-header-settings]");
dataHeaderSettings.addEventListener("click", function () {
  const dataSettingsOverlay = document.querySelector("[data-settings-overlay]");
  dataSettingsOverlay.open = true; // Open the settings overlay
});

dataSearchForm = document.querySelector("[data-search-form]");
dataSearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    let genreMatch = false;

    if (filters.genre === "any") {
      genreMatch = true;
    } else {
      for (const genre of book.genres) {
        if (genre === filters.genre) {
          genreMatch = true;
          break;
        }
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }

    const dataSearchOverlay = document.querySelector("[data-search-overlay]");
    dataSearchOverlay.open = false; // Close search overlay
  }

  const dataListMessage = document.querySelector("[data-list-message]");
  let dataListItems = document.querySelector("[data-list-items]");

  if (result.length < 1) {
    dataListMessage.classList.add("list__message_show"); // Show message
    dataListItems.innerHTML = ""; // Clear book list
  } else {
    dataListMessage.classList.remove("list__message_show"); // Remove message

    dataListItems.innerHTML = ""; // Clear list
    matches = result; // Update the 'matches' array with filtered books
    const extracted = matches.slice(0, BOOKS_PER_PAGE);
    console.log(extracted);
    // Create preview elements
    for (const {
      author,
      image,
      title,
      id,
      description,
      published,
    } of extracted) {
      const preview = bookPreview.create({
        author,
        image,
        title,
        id,
        description,
        published,
      });
      preview.dataset.listPreview = id;
      fragment.appendChild(preview);
    }

    dataListItems.appendChild(fragment);

    dataListButton.textContent = `Show more (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })`;
    // Disable the button if there are no more books to show
    dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;
  }
});

dataSettingsOverlay = document.querySelector("[data-settings-overlay]");
dataSettingsOverlay.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);

  // Update color scheme based on the selected theme
  document.documentElement.style.setProperty(
    "--color-dark",
    css[result.theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    css[result.theme].light
  );
  dataSettingsOverlay.open = false;
});

// Get all elements with 'data-list-items'
dataListItems = document.querySelectorAll("[data-list-items]");
dataListItems.forEach(function (element) {
  element.addEventListener("click", function (event) {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) {
        break;
      }
      const previewId = node?.dataset?.listPreview;

      for (const singleBook of books) {
        if (singleBook.id === previewId) {
          active = singleBook;
          break;
        }
      }
    }

    if (!active) {
      return;
    }

    // Use bookPreview.display
    bookPreview.display(active);
  });
});
