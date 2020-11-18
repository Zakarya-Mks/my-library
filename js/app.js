let book_collection = [
  {
    id: 1,
    title: 'a song of ice and fire',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': true,
  },
  {
    id: 2,
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': false,
  },
  {
    id: 3,
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': true,
  },
  {
    id: 4,
    title: 'a song of ice and fire 4',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': false,
  },
];

// add books to the localStorage
(function add_testing_books() {
  localStorage.setItem('book_collection', JSON.stringify(book_collection));
})();

function add_book_to_ui(book) {
  let book_template_html = `
  <div class="single_book ${
    book['read-status'] ? 'read' : 'not-read'
  }" id="book-${book.id}">
  <span class="material-icons remove-book"> highlight_off </span>
  <h3 class="book-title">${book.title}</h3>
  <span class="book-author">
  <span class="b-lable">By: </span>${book.author}</span>
  <span class="pages-count">
    <span class="b-lable">Number of pages: </span> ${
      book['nbr-of-pages']
    }</span>
  <span class="book-language">
    <span class="b-lable">Language: </span> ${book.language}</span>
  <span class="book-published">
    <span class="b-lable">Published: </span> ${book['publishing-date']}</span>
</div>`;

  document
    .querySelector('.row')
    .insertAdjacentHTML('beforeend', book_template_html);
}

function remove_book_from_ui(book_id) {
  document
    .querySelector('.row')
    .removeChild(document.querySelector(`#book-${book_id}`));
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

document.querySelector('.row').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-book')) {
    let book_id = e.target.parentNode.id.substring(
      e.target.parentNode.id.indexOf('-') + 1
    );

    remove_book_from_localeStorage(book_id);
    remove_book_from_ui(book_id);
  }
});
