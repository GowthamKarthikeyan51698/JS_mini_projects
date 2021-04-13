class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}
class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // create tr element
        const row = document.createElement('tr');
        // insert data
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='delete'</a>X</td>
        `;
        list.appendChild(row);
    }
    showAlert(message, className) {
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        // insert alert
        container.insertBefore(div, form); // to place the alert before form.
        // Timeout after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}
// local Storage class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;
            // Add book to UI
            ui.addBookToList(book);
        });
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            } 
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit',function(e){
    
    // Get form values
    const title = document.getElementById('title').value,
         author = document.getElementById('author').value,
         isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate 
    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    
    } else {
        // add book to list
        ui.addBookToList(book);

        // Add to Local Storage
        Store.addBook(book);

        // show success
        ui.showAlert('Book Added', 'success');

        // Clear the fields
        ui.clearFields();
    }

    e.preventDefault();
});
// Event Listener for deleting book
document.getElementById('book-list').addEventListener('click',function(e){
    
    // Instantiate UI
    const ui = new UI;

    // delete book
    ui.deleteBook(e.target);

    // remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    // show message
    ui.showAlert('Book Removed', 'success')

    e.preventDefault();
});