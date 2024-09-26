document.getElementById('searchButton').addEventListener('click', searchBooks);

// Show the loader while fetching random books on page load
showLoader();
fetchRandomBooks();

// Create a new Date object
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
document.getElementById("year").innerHTML = currentYear;

// Show loader function
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Hide loader function
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    const bookList = document.getElementById('bookList');
    
    if (searchInput) {
        showLoader(); // Show the loader while fetching data
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchInput)}`)
            .then(response => response.json())
            .then(data => {
                hideLoader(); // Hide the loader after data is fetched
                if (data.docs && data.docs.length > 0) {
                    displayBooks(data.docs, 'bookList');
                    searchResultsTitle.style.display = 'block'; // Show the title when results are available
                } else {
                    displayNoResultsMessage('bookList');
                    searchResultsTitle.style.display = 'block'; // Show the title even if no results found
                }
            })
            .catch(error => {
                hideLoader(); // Hide loader if there is an error
                console.error('Error:', error);
            });
    } else {
        alert('Please enter a search term.');
    }
}

function displayBooks(books, containerId) {
    const bookList = document.getElementById(containerId);
    bookList.innerHTML = ''; // Clear any previous content

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        const title = book.title ? book.title : 'No title available';
        const author = book.author_name && book.author_name.length > 0 
            ? book.author_name[0] 
            : 'Unknown Author';

        const coverId = book.cover_i ? book.cover_i : '';
        const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : 'https://via.placeholder.com/200x250.png?text=No+Cover';

        const openLibraryId = book.key ? book.key : '';
        const bookUrl = `https://openlibrary.org${openLibraryId}`;

        bookItem.innerHTML = `
            <img src="${coverUrl}" alt="${title}">
            <h2>${title}</h2>
            <p>by ${author}</p>
            <a href="${bookUrl}" target="blank">View</a>
        `;

        bookList.appendChild(bookItem);
    });
}

// Function to handle "No Results" case
function displayNoResultsMessage(containerId) {
    const bookList = document.getElementById(containerId);
    bookList.innerHTML = `<p>No results found. Please try a different search term.</p>`;
}

// Fetch random books and display them
function fetchRandomBooks() {
    fetch('https://openlibrary.org/subjects/children.json?limit=15')
        .then(response => response.json())
        .then(data => {
            hideLoader(); // Hide loader once data is fetched
            if (data.works && data.works.length > 0) {
                const randomBooks = data.works.map(work => {
                    return {
                        title: work.title,
                        author_name: work.authors ? [work.authors[0].name] : ['Unknown Author'],
                        cover_i: work.cover_id,
                        key: work.key
                    };
                });
                displayBooks(randomBooks, 'randomBookList');
            }
        })
        .catch(error => {
            hideLoader(); // Hide loader if there is an error
            console.error('Error fetching random books:', error);
        });
}
