// auto add a book to local storage
const book_collection = [
  {
    id: 1,
    title: 'A Game of Thrones ',
    author: 'George R. R. Martin',
    nbr_of_pages: '694',
    language: '	English',
    publishing_date: 'July 1 1996',
    read_status: true,
    insertion_date: '11/23/2020, 1:48:58 PM',
  },
];

// add books to the localStorage
(function add_testing_books() {
  localStorage.setItem('book_collection', JSON.stringify(book_collection));
})();

// capitalize first letter of any string
// source stackoverflow
String.prototype.capitalize = function () {
  return this.toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};

class _localStorage {
  static read(book_id) {
    book_id = parseInt(book_id);

    let local_storage_book_collection = localStorage.getItem('book_collection');
    let book_collection = JSON.parse(local_storage_book_collection);

    if (local_storage_book_collection && book_collection.length > 0) {
      if (book_id) {
        return new Book(
          book_collection.filter((book) => book.id === book_id)[0]
        );
      } else {
        return book_collection;
      }
    } else {
      return false;
    }
  }

  static write(book_collection) {
    let book_array = Array.isArray(book_collection)
      ? book_collection
      : [book_collection];
    localStorage.setItem('book_collection', JSON.stringify(book_array));
  }

  static add(book) {
    let local_storage_book_collection = _localStorage.read();
    if (local_storage_book_collection) {
      local_storage_book_collection.push(book);

      _localStorage.write(local_storage_book_collection);
    } else {
      _localStorage.write(book);
    }
  }

  static remove(rm_book_id) {
    rm_book_id = parseInt(rm_book_id);
    let local_storage_book_collection = _localStorage.read();
    if (local_storage_book_collection) {
      let temp_collection = local_storage_book_collection.filter((book) => {
        if (book.id != rm_book_id) {
          return book;
        }
      });

      _localStorage.write(temp_collection);
    }
  }

  static update(book) {
    let local_storage_book_collection = _localStorage.read();
    if (local_storage_book_collection) {
      let temp_collection = local_storage_book_collection.map((element) => {
        if (element.id === book.id) {
          return book;
        } else {
          return element;
        }
      });
      _localStorage.write(temp_collection);
    }
  }
}

class Book {
  constructor(book) {
    this.id = book.id || null;
    this.title = book.title;
    this.author = book.author;
    this.nbr_of_pages = book.nbr_of_pages;
    this.language = book.language;
    this.publishing_date = book.publishing_date;
    this.read_status = book.read_status;
    this.insertion_date = new Date().toLocaleString();
  }

  get htmlMarkup() {
    const book_html_template = `
    <div class="single_book scale-in-center ${
      this.read_status ? 'read' : ''
    }" id="book-${this.id}">
      <span class="material-icons remove-book"> close </span>
      <h3 class="book-title">${this.title}</h3>
      <span class="book-author">
      <span class="b-lable">By: </span>${this.author}</span>
      <span class="pages-count">
        <span class="b-lable">Number of pages: </span> ${
          this.nbr_of_pages
        }</span>
      <span class="book-language">
        <span class="b-lable">Language: </span> ${this.language}</span>
      <span class="book-published">
        <span class="b-lable">Published: </span> ${this.publishing_date}</span>

      <span class="read_toggle_label">Mark as read:</span>
      <label class="toggle-control">
        <input type="checkbox" id="read_toggle" ${
          this.read_status ? 'checked' : 'unchecked'
        }>
        <span class="control"></span>
      </label>

    </div>`;

    return book_html_template;
  }

  get generateID() {
    let book_collection = _localStorage.read();
    if (book_collection) {
      let last_book = book_collection[book_collection.length - 1];

      return last_book.id + 1;
    } else {
      return 1;
    }
  }

  toggleReadOrNot() {
    this.read_status = !this.read_status;
  }
}

class VueManager {
  constructor(dom_element) {
    this.dom_element = dom_element;
  }

  checkForEmptyBookCollection() {
    let book_collection = _localStorage.read();
    let order_by_dom_el = Array.from(
      document.querySelectorAll('.order select')
    );
    if (!book_collection || book_collection.length === 0) {
      empty_lib_section.style.display = 'flex';
      order_by_dom_el.forEach((element) => {
        element.disabled = true;
      });
    } else {
      empty_lib_section.style.display = 'none';

      order_by_dom_el.forEach((element) => {
        element.disabled = false;
      });
    }
  }

  clearFormFields() {
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

  checkUserEntries() {
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

  generateBookFromUserEntries() {
    let temp_book = {};
    new_book_input_fields.forEach((element) => {
      const element_id = element.id.substr(element.id.indexOf('-') + 1);

      if (element.tagName.toLowerCase() === 'select') {
        temp_book[`${element_id}`] = element.value === 'true';
      } else if (element.type.toLowerCase() === 'date') {
        let book_formatted_date = new Date(element.value).toDateString();

        temp_book[`${element_id}`] = book_formatted_date.substring(
          book_formatted_date.indexOf(' ') + 1
        );
      } else if (element.type.toLowerCase() === 'number') {
        temp_book[`${element_id}`] = element.value;
      } else {
        temp_book[`${element_id}`] = element.value.capitalize();
      }
    });

    let book = new Book(temp_book);
    book.id = book.generateID;
    return book;
  }

  removeBook(book_id) {
    bookshelf.dom_element.removeChild(
      document.querySelector(`#book-${book_id}`)
    );

    bookshelf.checkForEmptyBookCollection();
  }

  displayBook(book) {
    bookshelf.checkForEmptyBookCollection();
    bookshelf.dom_element.insertAdjacentHTML('afterbegin', book);

    read_toggle = document.querySelector('#read_toggle');
  }

  displayBookCollection(book_collection) {
    //clear the bookshelf to display the collection
    Array.from(bookshelf.dom_element.children).forEach((item) => {
      if (item.className !== 'empty_library_section') {
        bookshelf.dom_element.removeChild(item);
      }
    });

    book_collection.forEach((element) => {
      let book = new Book(element);
      bookshelf.displayBook(book.htmlMarkup);
    });
  }

  updateBookStatus(id) {
    document.querySelector(`#${id}`).classList.toggle('read');
  }

  updateBookLog() {
    const local_book_collection = _localStorage.read();
    if (local_book_collection) {
      books_total_count.textContent = local_book_collection.length;
      let read = local_book_collection.filter((book) => book.read_status);
      read_count.textContent = read.length;
      not_read_count.textContent = local_book_collection.length - read.length;
    } else {
      books_total_count.textContent = 0;
      read_count.textContent = 0;
      not_read_count.textContent = 0;
    }
  }

  reorder() {
    let order_by = order_by_toggle.value;
    let order = order_toggle.value === 'ascending' ? true : false;
    let book_collection = _localStorage.read();

    // if the selected order is ascending the order value is true and the array is sorted accordingly else its false and again the array is sorted accordingly

    if (order_by === 'insertion_date') {
      book_collection.sort(function (a, b) {
        let result = order
          ? new Date(b.insertion_date) - new Date(a.insertion_date)
          : new Date(a.insertion_date) - new Date(b.insertion_date);
        return result;
      });
    }

    if (order_by === 'publishing_date') {
      book_collection.sort(function (a, b) {
        let result = order
          ? new Date(b.publishing_date) - new Date(a.publishing_date)
          : new Date(a.publishing_date) - new Date(b.publishing_date);
        return result;
      });
    }

    bookshelf.displayBookCollection(book_collection);
  }
}

//im selection the second row avoiding the status_bar row
const bookshelf = new VueManager(document.querySelectorAll('.row')[1]);
const new_book_form = new VueManager(document.querySelector('.new-book-form'));

//dom Elements
const add_new_book_btn = document.querySelector('.new-book');
const new_book_section = document.querySelector('.add_book_section');
const new_book_input_fields = document.querySelectorAll(
  'input, .new-book-form select'
);
const empty_lib_section = document.querySelector('.empty_library_section');
const books_total_count = document.querySelector('#books_count');
const read_count = document.querySelector('#read_b_count');
const not_read_count = document.querySelector('#not_read_b_count');
const order_by_toggle = document.querySelector('#order_by');
const order_toggle = document.querySelector('#order');
let read_toggle = null;
const dark_mode_toggle = document.querySelector('#dark-mode-toggle');

window.addEventListener('load', (e) => {
  bookshelf.checkForEmptyBookCollection();
  bookshelf.updateBookLog();

  const local_book_collection = _localStorage.read();

  bookshelf.displayBookCollection(local_book_collection);
});

bookshelf.dom_element.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-book')) {
    let book_id = e.target.parentNode.id.substring(
      e.target.parentNode.id.indexOf('-') + 1
    );
    _localStorage.remove(book_id);
    document
      .querySelector(`#book-${book_id}`)
      .classList.add('scale-out-center');

    setTimeout(() => {
      bookshelf.removeBook(book_id);
      bookshelf.updateBookLog();
    }, 350);
  } else if (e.target.id === 'read_toggle') {
    let book_id = e.target.parentNode.parentNode.id;
    let clicked_book = _localStorage.read(
      book_id.substring(book_id.indexOf('-') + 1)
    );
    clicked_book.toggleReadOrNot();
    _localStorage.update(clicked_book);
    bookshelf.updateBookStatus(book_id);

    bookshelf.updateBookLog();
  }
});

// document events listeners
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

    new_book_form.clearFormFields();
  }
});

new_book_form.dom_element.addEventListener('click', (e) => {
  // clear fields button events
  if (e.target.classList.contains('clear')) {
    new_book_form.clearFormFields();
  }

  // add new book button event
  else if (e.target.classList.contains('add-book')) {
    if (new_book_form.checkUserEntries()) {
      const new_book = new_book_form.generateBookFromUserEntries();
      _localStorage.add(new_book);
      let rendered_book = new_book.htmlMarkup;
      bookshelf.displayBook(rendered_book);
      new_book_form.clearFormFields();
      new_book_section.style.display = 'none';
    }

    bookshelf.updateBookLog();
  }
});

order_by_toggle.addEventListener('change', (e) => {
  bookshelf.reorder();
});

order_toggle.addEventListener('change', (e) => {
  bookshelf.reorder();
});

dark_mode_toggle.addEventListener('click', (e) => {
  const dark_mode_link = document.querySelector('#dark-css');
  if (dark_mode_link.getAttribute('href')) {
    dark_mode_toggle.style.color = '#000';
    dark_mode_link.removeAttribute('href');
  } else {
    dark_mode_toggle.style.color = '#fff';
    dark_mode_link.setAttribute('href', 'dark-theme.css');
  }
});
