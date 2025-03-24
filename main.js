// Daftar buku yang disimpan di localStorage
let books = [];

// Memuat data dari localStorage saat halaman pertama kali dibuka
const loadBooksFromStorage = () => {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks).map((book) => ({
      ...book,
      year: parseInt(book.year, 10), //TODO Perbaikan saya terkait properti year yg seharusnya number
    }));
    renderBooks();
  }
};

// Menyimpan daftar buku ke localStorage
const saveBooksToStorage = () => {
  localStorage.setItem("books", JSON.stringify(books));
};

// Menambahkan buku baru ke dalam daftar
const addBook = (title, author, year, isComplete) => {
  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    year: parseInt(year, 10), //TODO Perbaikan saya terkait properti year yg seharusnya number
    isComplete,
  };
  books.push(newBook);
  saveBooksToStorage();
  renderBooks();
};

// Menghapus buku dari daftar
const deleteBook = (id) => {
  books = books.filter((book) => book.id !== id);
  saveBooksToStorage();
  renderBooks();
};

// Mengubah status selesai dibaca
const toggleComplete = (id) => {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
  }
};

// Mencari buku berdasarkan judul
const searchBooks = (title) => {
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
  renderBooks(filteredBooks);
};

// Merender daftar buku
const renderBooks = (filteredBooks = books) => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  // Reset daftar
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete('${book.id}')">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton" onclick="deleteBook('${book.id}')">Hapus Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

// Event listener untuk menambah buku
const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);

  bookForm.reset();
  document.getElementById("bookFormSubmit").querySelector("span").textContent = "Belum selesai dibaca";
});

// Event listener untuk mencari buku
const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleSearch = document.getElementById("searchBookTitle").value;
  searchBooks(titleSearch);
});

// Memuat data dari localStorage saat pertama kali dijalankan
document.addEventListener("DOMContentLoaded", loadBooksFromStorage);
