let books = [
  {
    title: 'a song of ice and fire',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': true,
  },
  {
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': false,
  },
  {
    title: 'a song of ice and fire 3',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': true,
  },
  {
    title: 'a song of ice and fire 4',
    author: 'george r.r martin',
    'nbr-of-pages': '649',
    language: 'english',
    'publishing-date': '01/07/1996',
    'read-status': false,
  },
];

// (function add_testing_books() {
//   localStorage.setItem(books, JSON.stringify(books));
// })();

function add_book_to_ui(book) {
  let book_template_html = `
  <div class="single_book ${
    book['read-status'] ? 'read' : 'not-read'
  }" id="book-01">
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

window.addEventListener('load', (e) => {
  if (localStorage.getItem(books)) {
    let saved_books = JSON.parse(localStorage.getItem(books));
    console.log(saved_books);
    saved_books.forEach((book) => {
      add_book_to_ui(book);
    });
  }
});
