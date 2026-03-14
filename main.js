(() => {
  const STORAGE_KEY = 'BOOKSHELF_APPS_DATA';
  let books = [];

  const bookForm = document.getElementById('bookForm');
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  const searchBookForm = document.getElementById('searchBook');
  const checkboxIsComplete = document.getElementById('bookFormIsComplete');

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
  };

  const loadFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) books = JSON.parse(data);
    renderBooks();
  };

  const addBook = (e) => {
    e.preventDefault();
    
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = checkboxIsComplete.checked;

  
    if (!title || !author || isNaN(year)) return;

    const newBook = {
      id: +new Date(), 
      title,
      author,
      year,
      isComplete
    };

    books.push(newBook);
    saveToStorage();
    bookForm.reset();
    updateSubmitButtonText();
  };

  const toggleBookStatus = (bookId) => {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = !books[bookIndex].isComplete;
      saveToStorage(); 
    }
  };

  const deleteBook = (bookId) => {
    if (confirm('Hapus buku ini secara permanen?')) {
      books = books.filter(b => b.id !== bookId);
      saveToStorage();
    }
  };

  const editBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newTitle = prompt('Ubah Judul:', book.title);
    const newAuthor = prompt('Ubah Penulis:', book.author);
    const newYear = prompt('Ubah Tahun:', book.year);

    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = parseInt(newYear);
      saveToStorage();
    }
  };

  const searchBooks = (e) => {
    e.preventDefault();
    const query = document.getElementById('searchBookTitle').value.toLowerCase();
    const filtered = books.filter(b => b.title.toLowerCase().includes(query));
    renderBooks(filtered);
  };

  const renderBooks = (dataToRender = books) => {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    dataToRender.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.setAttribute('data-bookid', book.id);
      bookElement.setAttribute('data-testid', 'bookItem');
      bookElement.classList.add('book-card');

      bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="action-group">
          <button data-testid="bookItemIsCompleteButton" class="btn-status">
            ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
          </button>
          <button data-testid="bookItemDeleteButton" class="btn-delete">Hapus buku</button>
          <button data-testid="bookItemEditButton" class="btn-edit">Edit buku</button>
        </div>
      `;

      bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').onclick = () => toggleBookStatus(book.id);
      bookElement.querySelector('[data-testid="bookItemDeleteButton"]').onclick = () => deleteBook(book.id);
      bookElement.querySelector('[data-testid="bookItemEditButton"]').onclick = () => editBook(book.id);

      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  const updateSubmitButtonText = () => {
    const span = document.querySelector('#bookFormSubmit span');
    if (checkboxIsComplete.checked) {
      span.innerText = 'Selesai dibaca';
    } else {
      span.innerText = 'Belum selesai dibaca';
    }
  };

  bookForm.addEventListener('submit', addBook);
  searchBookForm.addEventListener('submit', searchBooks);
  checkboxIsComplete.addEventListener('change', updateSubmitButtonText);

  document.addEventListener('DOMContentLoaded', loadFromStorage);
})();