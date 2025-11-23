document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener referencias a elementos del DOM
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    const bookIdInput = document.getElementById('book-id');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // 2. Clave para localStorage
    const STORAGE_KEY = 'myPersonalLibrary';

    // Función para obtener los libros del localStorage (READ - persistencia)
    function getBooks() {
        const booksJSON = localStorage.getItem(STORAGE_KEY);
        // Si no hay datos, devuelve un array vacío
        return booksJSON ? JSON.parse(booksJSON) : [];
    }

    // Función para guardar los libros en localStorage
    function saveBooks(books) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    // Función principal para renderizar la lista de libros (READ)
    function renderBooks() {
        const books = getBooks();
        bookList.innerHTML = ''; // Limpia el contenido actual

        if (books.length === 0) {
            // Mostrar mensaje de vacío
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="empty-message">No hay libros en tu biblioteca. ¡Añade uno!</td>`;
            bookList.appendChild(row);
            return;
        }

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${book.id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${book.id}">Borrar</button>
                </td>
            `;
            bookList.appendChild(row);
        });
    }

    // 3. Manejar el envío del formulario (CREATE/UPDATE)
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const id = bookIdInput.value;
        let books = getBooks();

        if (title === '' || author === '') {
            alert('Por favor, rellena los campos de Título y Autor.');
            return;
        }

        if (id) {
            // Actualizar libro (UPDATE)
            const bookIndex = books.findIndex(b => b.id.toString() === id);
            if (bookIndex > -1) {
                books[bookIndex].title = title;
                books[bookIndex].author = author;
                alert('Libro actualizado exitosamente.');
            }
        } else {
            // Crear nuevo libro (CREATE)
            const newBook = {
                // Generar un ID simple basado en el timestamp para unicidad
                id: Date.now(),
                title: title,
                author: author
            };
            books.push(newBook);
            alert('Libro añadido exitosamente.');
        }

        saveBooks(books);
        resetForm(); // Limpiar y restablecer el formulario
        renderBooks(); // Volver a dibujar la lista
    });

    // 4. Manejar las acciones de la lista (EDITAR y BORRAR)
    bookList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        
        if (!id) return;

        if (target.classList.contains('delete-btn')) {
            // Eliminar libro (DELETE)
            if (confirm('¿Estás seguro de que quieres borrar este libro?')) {
                deleteBook(id);
            }
        } else if (target.classList.contains('edit-btn')) {
            // Cargar datos para edición (SETUP UPDATE)
            editBook(id);
        }
    });

    // Función para borrar un libro (DELETE)
    function deleteBook(id) {
        let books = getBooks();
        // Filtra para crear un nuevo array SIN el libro a borrar
        books = books.filter(book => book.id.toString() !== id);
        
        saveBooks(books);
        renderBooks();
        alert('Libro borrado exitosamente.');
    }

    // Función para preparar la edición (UPDATE setup)
    function editBook(id) {
        const books = getBooks();
        const bookToEdit = books.find(book => book.id.toString() === id);

        if (bookToEdit) {
            // Cargar datos del libro en el formulario
            bookIdInput.value = bookToEdit.id;
            titleInput.value = bookToEdit.title;
            authorInput.value = bookToEdit.author;

            // Cambiar la apariencia del botón
            submitBtn.textContent = 'Guardar Cambios';
            submitBtn.style.backgroundColor = 'var(--accent-color)';
            cancelBtn.style.display = 'inline-block';
            
            // Enfocar el formulario
            titleInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Función para restablecer el formulario a modo "Añadir"
    function resetForm() {
        bookForm.reset(); // Limpia los campos
        bookIdInput.value = ''; // Limpia el ID oculto
        submitBtn.textContent = 'Añadir Libro';
        submitBtn.style.backgroundColor = 'var(--success-color)';
        cancelBtn.style.display = 'none';
    }

    // Manejar clic en "Cancelar Edición"
    cancelBtn.addEventListener('click', resetForm);

    // 5. Inicialización: Cargar y mostrar los libros al inicio
    renderBooks();
});