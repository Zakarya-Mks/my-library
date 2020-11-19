function Book(
  id,
  title,
  author,
  nbr_of_pages,
  language,
  publishing_date,
  read_status
) {
  this.id = id;
  this.title = title;
  (this.author = author), nbr_of;
  this.nbr_of_pages = nbr_of_pages;
  this.language = language;
  this.publishing_date = publishing_date;
  this.read_status = read_status;
}

const book_collection = [
  {
    id: 4,
    title: 'a song of ice and fire 1',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: true,
  },
  {
    id: 6,
    title: 'a song of ice and fire 2',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: false,
  },
  {
    id: 7,
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: true,
  },
  {
    id: 8,
    title: 'a song of ice and fire 4',
    author: 'george r.r martin',
    nbr_of_pages: '649',
    language: 'english',
    publishing_date: '01/07/1996',
    read_status: false,
  },
];

//dom elements
const bookshelf = document.querySelector('.row');
const add_new_book_btn = document.querySelector('.new-book');
const new_book_section = document.querySelector('.add_book_section');
const new_book_input_fields = document.querySelectorAll('input, select');
document.querySelector('select');
const new_book_form = document.querySelector('.new-book-form');

// add books to the localStorage
(function add_testing_books() {
  localStorage.setItem('book_collection', JSON.stringify(book_collection));
})();

function add_book_to_ui(book) {
  let book_template_html = `
  <div class="single_book ${book.read_status ? 'read' : 'not-read'}" id="book-${
    book.id
  }">
  <span class="material-icons remove-book"> highlight_off </span>
  <h3 class="book-title">${book.title}</h3>
  <span class="book-author">
  <span class="b-lable">By: </span>${book.author}</span>
  <span class="pages-count">
    <span class="b-lable">Number of pages: </span> ${book.nbr_of_pages}</span>
  <span class="book-language">
    <span class="b-lable">Language: </span> ${book.language}</span>
  <span class="book-published">
    <span class="b-lable">Published: </span> ${book.publishing_date}</span>
</div>`;

  bookshelf.insertAdjacentHTML('beforeend', book_template_html);
}

function remove_book_from_ui(book_id) {
  bookshelf.removeChild(document.querySelector(`#book-${book_id}`));
}

function remove_book_from_localeStorage(rm_book_id) {
  let temp_books_collection = JSON.parse(
    localStorage.getItem('book_collection')
  ).filter((book) => {
    if (book.id != rm_book_id) {
      return book;
    }
  });

  localStorage.setItem(
    'book_collection',
    JSON.stringify(temp_books_collection)
  );
}

function new_book_form_clear_fields() {
  new_book_input_fields.forEach((field) => {
    if (field.tagName.toLowerCase() == 'select') {
      field.selectedIndex = 0;
      field.nextSibling.style.display = 'none';
    } else {
      field.value = '';
      field.nextSibling.style.display = 'none';
    }
  });
}

function check_user_input() {
  let score = 6;
  new_book_input_fields.forEach((element) => {
    if (element.tagName.toLowerCase() === 'select') {
      element.value === 'null'
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else if (element.type.toLowerCase() === 'date') {
      element.value === ''
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else if (element.type.toLowerCase() === 'number') {
      isNaN(parseInt(element.value))
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    } else {
      element.value.trim() === ''
        ? (score--, (element.nextSibling.style.display = 'block'))
        : (element.nextSibling.style.display = 'none');
    }
  });

  return score === 6 ? true : false;
}

function get_book_form_input_fields() {
  let temp_book = {};
  new_book_input_fields.forEach((element) => {
    const element_id = element.id.substr(element.id.indexOf('-') + 1);

    if (element.tagName.toLowerCase() === 'select') {
      temp_book[`${element_id}`] = element.value;
    } else if (element.type.toLowerCase() === 'date') {
      let book_formatted_date = new Date(element.value).toDateString();

      temp_book[`${element_id}`] = book_formatted_date.substring(
        book_formatted_date.indexOf(' ') + 1
      );
    } else if (element.type.toLowerCase() === 'number') {
      temp_book[`${element_id}`] = element.value;
    } else {
      temp_book[`${element_id}`] = element.value;
    }
  });

  console.log(temp_book);
}
function add_book_to_localStorage() {}

window.addEventListener('load', (e) => {
  if (localStorage.getItem('book_collection')) {
    let saved_books_collection = JSON.parse(
      localStorage.getItem('book_collection')
    );

    saved_books_collection.forEach((book) => {
      add_book_to_ui(book);
    });
  }
});

bookshelf.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-book')) {
    let book_id = e.target.parentNode.id.substring(
      e.target.parentNode.id.indexOf('-') + 1
    );

    remove_book_from_localeStorage(book_id);
    remove_book_from_ui(book_id);
  }
});

add_new_book_btn.addEventListener('click', (e) => {
  new_book_section.style.display = 'flex';
});

new_book_section.addEventListener('click', (e) => {
  // close form if clicked on the empty portion or on close btn
  if (
    e.target.className === 'add_book_section' ||
    e.target.classList.contains('close-form')
  ) {
    new_book_section.style.display = 'none';

    new_book_form_clear_fields();
  }
});

new_book_form.addEventListener('click', (e) => {
  // clear fields button events
  if (e.target.classList.contains('clear')) {
    new_book_form_clear_fields();
  }

  // add new book button event
  else if (e.target.classList.contains('add-book')) {
    if (check_user_input()) {
      get_book_form_input_fields();
      add_book_to_localStorage();
    }
  }
});
