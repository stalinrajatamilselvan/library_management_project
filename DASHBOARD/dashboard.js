// ============================================
// DIGITAL LIBRARY DASHBOARD
// ============================================


// ============================================
// CHECK LOGIN
// ============================================

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if (!currentUser) {

    alert(
        "Please login to access the dashboard."
    );

    window.location.href =
        "../LOGIN/login.html";
}


// ============================================
// SAMPLE BOOK DATA
// ============================================

let books =
    JSON.parse(
        localStorage.getItem("libraryBooks")
    ) || [

        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            category: "Fiction",
            status: "Available",
            icon: "📕"
        },

        {
            id: 2,
            title: "A Brief History of Time",
            author: "Stephen Hawking",
            category: "Science",
            status: "Borrowed",
            icon: "📘"
        },

        {
            id: 3,
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "Technology",
            status: "Available",
            icon: "💻"
        },

        {
            id: 4,
            title: "The Art of War",
            author: "Sun Tzu",
            category: "History",
            status: "Available",
            icon: "📙"
        },

        {
            id: 5,
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "Fiction",
            status: "Available",
            icon: "📔"
        },

        {
            id: 6,
            title: "Cosmos",
            author: "Carl Sagan",
            category: "Science",
            status: "Available",
            icon: "🌌"
        }

    ];


// ============================================
// SAMPLE MEMBER DATA
// ============================================

let members =
    JSON.parse(
        localStorage.getItem("libraryMembers")
    ) || [

        {
            id: 1,
            name: "Arun Kumar",
            email: "arun@gmail.com",
            phone: "9876543210",
            books: 2,
            status: "Active"
        },

        {
            id: 2,
            name: "Priya Sharma",
            email: "priya@gmail.com",
            phone: "9876543211",
            books: 1,
            status: "Active"
        },

        {
            id: 3,
            name: "Rahul Raj",
            email: "rahul@gmail.com",
            phone: "9876543212",
            books: 0,
            status: "Active"
        }

    ];


const storedIssues =
    localStorage.getItem("libraryIssues");

let issues =
    storedIssues
        ? JSON.parse(storedIssues)
        : [];

const storedReturnedIssues =
    localStorage.getItem("libraryReturnedIssues");

let returnedIssues =
    storedReturnedIssues
        ? JSON.parse(storedReturnedIssues)
        : [];

if (storedIssues === null) {

    books
        .filter(book => book.status === "Borrowed")
        .forEach(book => {
            issues.push({
                id: `legacy-${book.id}`,
                bookId: book.id,
                memberId: book.issuedTo ?? null,
                issuedAt: null
            });
        });

    localStorage.setItem(
        "libraryIssues",
        JSON.stringify(issues)
    );

}

books.forEach(book => {
    const quantity = Number(book.quantity);
    const issuedCopies =
        issues.filter(issue => issue.bookId === book.id).length;

    book.quantity = Math.max(
        Number.isInteger(quantity) && quantity > 0 ? quantity : 1,
        issuedCopies
    );
});

localStorage.setItem(
    "libraryBooks",
    JSON.stringify(books)
);


let editingBookId = null;
let editingMemberId = null;


// ============================================
// SAVE DATA
// ============================================

function saveBooks() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

}


function saveMembers() {

    localStorage.setItem(
        "libraryMembers",
        JSON.stringify(members)
    );

}


function saveIssues() {

    localStorage.setItem(
        "libraryIssues",
        JSON.stringify(issues)
    );

}


function saveReturnedIssues() {

    localStorage.setItem(
        "libraryReturnedIssues",
        JSON.stringify(returnedIssues)
    );

}


function getBookCode(book) {

    return `BK-${String(book.id).padStart(6, "0")}`;

}


function getNextBookId() {

    return books.reduce(
        (largestId, book) =>
            Math.max(largestId, Number(book.id) || 0),
        0
    ) + 1;

}


function getBookIssues(bookId) {

    return issues.filter(issue => issue.bookId === bookId);

}


function getAvailableCopies(book) {

    return Math.max(
        0,
        book.quantity - getBookIssues(book.id).length
    );

}


function getMemberIssueCount(memberId) {

    return issues.filter(issue => issue.memberId === memberId).length;

}


function syncMemberIssueCounts() {

    members.forEach(member => {
        member.books = getMemberIssueCount(member.id);
    });

}


syncMemberIssueCounts();
saveMembers();


// ============================================
// DISPLAY USER
// ============================================

function displayUser() {

    if (!currentUser) return;


    const name =
        currentUser.name || "User";

    const role =
        currentUser.role || "User";


    document
        .getElementById("dashboardUserName")
        .textContent = name;


    document
        .getElementById("welcomeName")
        .textContent = name;


    document
        .getElementById("dashboardUserRole")
        .textContent = role;


    const firstLetter =
        name.charAt(0).toUpperCase();


    document
        .getElementById("headerAvatar")
        .textContent = firstLetter;


}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}


// ============================================
// CREATE BOOK CARD
// ============================================

function createBookCard(book) {

    const bookIssues =
        getBookIssues(book.id);

    const availableCopies =
        getAvailableCopies(book);

    const memberCount =
        new Set(
            bookIssues
                .filter(issue => issue.memberId !== null)
                .map(issue => issue.memberId)
        ).size;

    const statusClass =
        availableCopies > 0
            ? "available"
            : "borrowed";

    return `

        <div class="book-card">

            <div class="book-cover">
                ${book.icon || "📚"}
            </div>

            <div class="book-info">

                <p class="book-id">
                    ${getBookCode(book)}
                </p>

                <h3>
                    ${escapeHtml(book.title)}
                </h3>

                <p class="book-author">
                    ${escapeHtml(book.author)}
                </p>

                <div class="book-bottom">

                    <span class="category">
                        ${escapeHtml(book.category)}
                    </span>

                    <span class="${statusClass}">
                        ● ${availableCopies > 0 ? "Available" : "Out of stock"}
                    </span>

                </div>

                <p class="copy-count">
                    Copies: ${book.quantity} · Issued: ${bookIssues.length} · Available: ${availableCopies} · Members: ${memberCount}
                </p>

                <div class="book-actions">

                    ${
                        availableCopies > 0
                            ? `<button class="action-btn issue-btn" onclick="openIssueModal(${book.id})">Issue</button>`
                            : ""
                    }

                    <button
                        class="action-btn edit-btn"
                        onclick="editBook(${book.id})">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-book"
                        onclick="deleteBook(${book.id})">
                        Delete
                    </button>

                </div>

            </div>

        </div>

    `;
}


// ============================================
// DISPLAY BOOKS
// ============================================

function displayBooks(
    bookList,
    elementId
) {

    const container =
        document.getElementById(elementId);


    if (!container) return;


    if (bookList.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <strong>
                    No Books Found
                </strong>

                <span>
                    Try another search or add a new book.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bookList
            .map(createBookCard)
            .join("");

}


// ============================================
// LOAD BOOKS
// ============================================

function loadBooks() {

    displayBooks(
        books,
        "booksGrid"
    );


    displayBooks(
        books.slice(0, 4),
        "dashboardBooks"
    );

}


// ============================================
// DELETE BOOK
// ============================================

function deleteBook(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) return;


    books =
        books.filter(
            book => book.id !== id
        );

    issues =
        issues.filter(issue => issue.bookId !== id);

    syncMemberIssueCounts();
    saveIssues();
    saveBooks();
    saveMembers();

    loadBooks();
    loadIssuedBooks();
    loadMembers();

    updateStatistics();

}


function editBook(id) {

    const book =
        books.find(item => item.id === id);

    if (!book) return;

    editingBookId = id;
    document.getElementById("bookId").value = getBookCode(book);
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookCategory").value = book.category;
    document.getElementById("bookQuantity").value = book.quantity;
    document.getElementById("bookModalTitle").textContent = "Edit Book";
    document.getElementById("bookSubmitText").textContent = "Save Changes";
    bookModal.classList.add("show");

}


function openIssueModal(id) {

    const availableBooks =
        books.filter(book => getAvailableCopies(book) > 0);

    if (availableBooks.length === 0) {
        alert("There are no available book copies to issue.");
        return;
    }

    if (members.length === 0) {
        alert("Add a member before issuing a book.");
        return;
    }

    const bookSelect =
        document.getElementById("issueBookSelect");

    bookSelect.replaceChildren(
        ...availableBooks.map(book =>
            new Option(
                `${getBookCode(book)} — ${book.title} (${getAvailableCopies(book)} available)`,
                book.id
            )
        )
    );

    if (id !== undefined && availableBooks.some(book => book.id === id)) {
        bookSelect.value = String(id);
    }

    updateIssueBookDetails();

    const memberSelect =
        document.getElementById("issueMember");

    memberSelect.replaceChildren(
        ...members.map(member =>
            new Option(member.name, member.id)
        )
    );

    issueModal.classList.add("show");

}


function updateIssueBookDetails() {

    const bookId =
        Number(document.getElementById("issueBookSelect").value);

    const book =
        books.find(item => item.id === bookId);

    document.getElementById("issueBookTitle").textContent =
        book
            ? `${getBookCode(book)} — ${book.title} by ${book.author}. ${getAvailableCopies(book)} copy/copies available.`
            : "";

}


function returnBook(issueId) {

    const issue =
        issues.find(item => item.id === issueId);

    if (!issue) return;

    returnedIssues.unshift({
        ...issue,
        returnedAt: new Date().toISOString()
    });

    issues =
        issues.filter(item => item.id !== issueId);

    syncMemberIssueCounts();
    saveIssues();
    saveReturnedIssues();
    saveMembers();
    loadBooks();
    loadIssuedBooks();
    loadMembers();
    updateStatistics();

}


// ============================================
// SEARCH BOOKS
// ============================================

document
    .getElementById("bookSearch")
    .addEventListener(
        "input",
        filterBooks
    );


document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterBooks
    );


function filterBooks() {

    const search =
        document
            .getElementById("bookSearch")
            .value
            .toLowerCase()
            .trim();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filtered =
        books.filter(book => {

            const matchesSearch =

                book.title
                    .toLowerCase()
                    .includes(search)

                ||

                book.author
                    .toLowerCase()
                    .includes(search)

                ||

                getBookCode(book)
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =

                category === "All"

                ||

                book.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayBooks(
        filtered,
        "booksGrid"
    );

}


// ============================================
// BOOK MODAL
// ============================================

const bookModal =
    document.getElementById("bookModal");

const issueModal =
    document.getElementById("issueModal");


document
    .getElementById("closeIssueModal")
    .addEventListener(
        "click",
        function () {
            issueModal.classList.remove("show");
        }
    );

document
    .getElementById("issueBookBtn")
    .addEventListener(
        "click",
        function () {
            openIssueModal();
        }
    );

document
    .getElementById("issueBookSelect")
    .addEventListener(
        "change",
        updateIssueBookDetails
    );

document
    .getElementById("issuedBookSearch")
    .addEventListener(
        "input",
        loadIssuedBooks
    );


document
    .getElementById("issueForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const book =
                books.find(
                    item => item.id === Number(
                        document.getElementById("issueBookSelect").value
                    )
                );

            const member =
                members.find(
                    item => item.id === Number(
                        document.getElementById("issueMember").value
                    )
                );

            if (!book || getAvailableCopies(book) < 1 || !member) {
                alert("The selected book or member is no longer available.");
                issueModal.classList.remove("show");
                return;
            }

            issues.unshift({
                id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                bookId: book.id,
                memberId: member.id,
                issuedAt: new Date().toISOString()
            });

            syncMemberIssueCounts();
            saveIssues();
            saveBooks();
            saveMembers();
            loadBooks();
            loadIssuedBooks();
            loadMembers();
            updateStatistics();

            issueModal.classList.remove("show");
            alert("Book issued successfully.");

        }
    );


document
    .getElementById("addBookBtn")
    .addEventListener(
        "click",
        function () {

            editingBookId = null;
            document.getElementById("bookForm").reset();
            document.getElementById("bookQuantity").value = 1;
            document.getElementById("bookId").value =
                getBookCode({ id: getNextBookId() });
            document.getElementById("bookModalTitle").textContent = "Add New Book";
            document.getElementById("bookSubmitText").textContent = "Add Book";
            bookModal
                .classList
                .add("show");

        }
    );


document
    .getElementById("closeBookModal")
    .addEventListener(
        "click",
        function () {

            editingBookId = null;
            document.getElementById("bookForm").reset();
            document.getElementById("bookQuantity").value = 1;
            document.getElementById("bookId").value = "";
            bookModal
                .classList
                .remove("show");

        }
    );


// ============================================
// ADD BOOK
// ============================================

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const wasEditing =
                editingBookId !== null;

            const title =
                document
                    .getElementById("bookTitle")
                    .value
                    .trim();


            const author =
                document
                    .getElementById("bookAuthor")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("bookCategory")
                    .value;

            const quantity =
                Number(document.getElementById("bookQuantity").value);

            if (!Number.isInteger(quantity) || quantity < 1) {
                alert("Enter a quantity of at least 1.");
                return;
            }


            if (editingBookId !== null) {

                const book =
                    books.find(item => item.id === editingBookId);

                if (!book) return;

                if (quantity < getBookIssues(book.id).length) {
                    alert("Quantity cannot be less than the number of copies currently issued.");
                    return;
                }

                book.title = title;
                book.author = author;
                book.category = category;
                book.quantity = quantity;

            } else {

                const nextId = getNextBookId();

                books.unshift({
                    id: nextId,
                    title: title,
                    author: author,
                    category: category,
                    quantity: quantity,
                    icon: "📚"
                });

            }


            saveBooks();

            loadBooks();
            loadIssuedBooks();
            updateStatistics();


            document
                .getElementById("bookForm")
                .reset();


            bookModal
                .classList
                .remove("show");

            editingBookId = null;
            document.getElementById("bookModalTitle").textContent = "Add New Book";
            document.getElementById("bookSubmitText").textContent = "Add Book";
            alert(wasEditing ? "Book updated successfully." : "Book added successfully.");

        }
    );


// ============================================
// MEMBERS
// ============================================

function createMemberRow(member) {

    const firstLetter =
        member.name
            .charAt(0)
            .toUpperCase();


    return `

        <tr>

            <td>

                <div class="member-name">

                    <div class="member-avatar">
                        ${escapeHtml(firstLetter)}
                    </div>

                    ${escapeHtml(member.name)}

                </div>

            </td>

            <td>
                ${escapeHtml(member.email)}
            </td>

            <td>
                ${escapeHtml(member.phone)}
            </td>

            <td>
                ${getMemberIssueCount(member.id)}
            </td>

            <td>

                <span class="member-status">
                    ● ${escapeHtml(member.status)}
                </span>

            </td>

            <td>

                <div class="member-actions">

                    <button
                        class="action-btn edit-btn"
                        onclick="editMember(${member.id})">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-member"
                        onclick="deleteMember(${member.id})">
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    `;

}


// ============================================
// DISPLAY MEMBERS
// ============================================

function displayMembers(
    memberList
) {

    const table =
        document.getElementById(
            "membersTable"
        );


    if (memberList.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;">

                    No members found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        memberList
            .map(createMemberRow)
            .join("");

}


// ============================================
// LOAD MEMBERS
// ============================================

function loadMembers() {

    displayMembers(members);

}


function loadIssuedBooks() {

    const table =
        document.getElementById("issuedBooksTable");

    const search =
        document.getElementById("issuedBookSearch")
            .value
            .trim()
            .toLowerCase();

    const filteredIssues =
        issues.filter(issue => {
            const book =
                books.find(item => item.id === issue.bookId);

            const member =
                members.find(item => item.id === issue.memberId);

            if (!book) return false;

            return [
                getBookCode(book),
                book.title,
                member ? member.name : "Member not recorded"
            ].some(value => value.toLowerCase().includes(search));
        });

    if (filteredIssues.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table-message">
                    ${issues.length === 0 ? "No books are currently issued." : "No issued books match your search."}
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = filteredIssues
        .map(issue => {
            const book =
                books.find(item => item.id === issue.bookId);

            const member =
                members.find(item => item.id === issue.memberId);

            if (!book) return "";

            const issueDate =
                issue.issuedAt
                    ? new Date(issue.issuedAt).toLocaleDateString()
                    : "Date not recorded";

            return `
                <tr>
                    <td>${getBookCode(book)}</td>
                    <td>${escapeHtml(book.title)}</td>
                    <td>${member ? escapeHtml(member.name) : "Member not recorded"}</td>
                    <td>${issueDate}</td>
                    <td>
                        <button
                            class="action-btn return-btn"
                            onclick="returnBook('${issue.id}')">
                            Return
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");

}


// ============================================
// DELETE MEMBER
// ============================================

function deleteMember(id) {

    const memberIssues =
        issues.filter(issue => issue.memberId === id);

    const confirmDelete =
        confirm(
            memberIssues.length
                ? `This member has ${memberIssues.length} issued book(s). Deleting the member will return them to the library. Continue?`
                : "Are you sure you want to delete this member?"
        );


    if (!confirmDelete) return;


    if (memberIssues.length) {
        issues =
            issues.filter(issue => issue.memberId !== id);
        saveIssues();
    }

    members =
        members.filter(
            member => member.id !== id
        );

    syncMemberIssueCounts();

    saveMembers();

    loadMembers();
    loadIssuedBooks();
    loadBooks();

    updateStatistics();

}


function editMember(id) {

    const member =
        members.find(item => item.id === id);

    if (!member) return;

    editingMemberId = id;
    document.getElementById("memberName").value = member.name;
    document.getElementById("memberEmail").value = member.email;
    document.getElementById("memberPhone").value = member.phone;
    document.getElementById("memberModalTitle").textContent = "Edit Member";
    document.getElementById("memberSubmitText").textContent = "Save Changes";
    memberModal.classList.add("show");

}


// ============================================
// MEMBER SEARCH
// ============================================

document
    .getElementById("memberSearch")
    .addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                members.filter(member => {

                    return (

                        member.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        member.email
                            .toLowerCase()
                            .includes(search)

                        ||

                        member.phone
                            .includes(search)

                    );

                });


            displayMembers(filtered);

        }
    );


// ============================================
// MEMBER MODAL
// ============================================

const memberModal =
    document.getElementById(
        "memberModal"
    );


document
    .getElementById("addMemberBtn")
    .addEventListener(
        "click",
        function () {

            editingMemberId = null;
            document.getElementById("memberForm").reset();
            document.getElementById("memberModalTitle").textContent = "Add New Member";
            document.getElementById("memberSubmitText").textContent = "Add Member";
            memberModal
                .classList
                .add("show");

        }
    );


document
    .getElementById("closeMemberModal")
    .addEventListener(
        "click",
        function () {

            editingMemberId = null;
            document.getElementById("memberForm").reset();
            memberModal
                .classList
                .remove("show");

        }
    );


// ============================================
// ADD MEMBER
// ============================================

document
    .getElementById("memberForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const wasEditing =
                editingMemberId !== null;

            const name =
                document
                    .getElementById("memberName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("memberEmail")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("memberPhone")
                    .value
                    .trim();


            if (editingMemberId !== null) {

                const member =
                    members.find(item => item.id === editingMemberId);

                if (!member) return;

                member.name = name;
                member.email = email;
                member.phone = phone;

            } else {

                members.unshift({
                    id: Date.now(),
                    name: name,
                    email: email,
                    phone: phone,
                    books: 0,
                    status: "Active"
                });

            }


            saveMembers();

            loadMembers();

            updateStatistics();


            document
                .getElementById("memberForm")
                .reset();


            memberModal
                .classList
                .remove("show");

            editingMemberId = null;
            document.getElementById("memberModalTitle").textContent = "Add New Member";
            document.getElementById("memberSubmitText").textContent = "Add Member";
            loadIssuedBooks();
            alert(wasEditing ? "Member updated successfully." : "Member added successfully.");

        }
    );


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics() {

    const total =
        books.reduce(
            (count, book) => count + book.quantity,
            0
        );


    const available =
        books.reduce(
            (count, book) => count + getAvailableCopies(book),
            0
        );


    const borrowed =
        issues.length;


    const memberCount =
        members.length;


    document
        .getElementById("totalBooks")
        .textContent = total;


    document
        .getElementById("availableBooks")
        .textContent = available;


    document
        .getElementById("borrowedBooks")
        .textContent = borrowed;


    document
        .getElementById("totalMembers")
        .textContent = memberCount;

    document
        .getElementById("reportTotalBooks")
        .textContent = total;

    document
        .getElementById("reportTotalMembers")
        .textContent = memberCount;

    document
        .getElementById("reportBooksIssued")
        .textContent = issues.length;

    document
        .getElementById("reportBooksReturned")
        .textContent = returnedIssues.length;

}


function escapeCsv(value) {

    return `"${String(value ?? "").replaceAll('"', '""')}"`;

}


function downloadReport() {

    const reportRows = [
        ["Library Report", new Date().toLocaleString()],
        [],
        ["Summary", "Count"],
        ["Total Books", books.reduce((count, book) => count + book.quantity, 0)],
        ["Total Members", members.length],
        ["Books Issued (currently)", issues.length],
        ["Books Returned (recorded)", returnedIssues.length],
        [],
        ["Book ID", "Title", "Author", "Category", "Quantity", "Issued Copies", "Available Copies"]
    ];

    books.forEach(book => {
        reportRows.push([
            getBookCode(book),
            book.title,
            book.author,
            book.category,
            book.quantity,
            getBookIssues(book.id).length,
            getAvailableCopies(book)
        ]);
    });

    reportRows.push(
        [],
        ["Issued Books"],
        ["Book ID", "Title", "Member", "Issue Date"]
    );

    issues.forEach(issue => {
        const book =
            books.find(item => item.id === issue.bookId);

        const member =
            members.find(item => item.id === issue.memberId);

        if (book) {
            reportRows.push([
                getBookCode(book),
                book.title,
                member ? member.name : "Member not recorded",
                issue.issuedAt
                    ? new Date(issue.issuedAt).toLocaleDateString()
                    : "Date not recorded"
            ]);
        }
    });

    reportRows.push(
        [],
        ["Returned Books"],
        ["Book ID", "Title", "Member", "Issue Date", "Return Date"]
    );

    returnedIssues.forEach(issue => {
        const book =
            books.find(item => item.id === issue.bookId);

        const member =
            members.find(item => item.id === issue.memberId);

        reportRows.push([
            book ? getBookCode(book) : `BK-${String(issue.bookId).padStart(6, "0")}`,
            book ? book.title : "Book removed",
            member ? member.name : "Member not recorded",
            issue.issuedAt
                ? new Date(issue.issuedAt).toLocaleDateString()
                : "Date not recorded",
            issue.returnedAt
                ? new Date(issue.returnedAt).toLocaleDateString()
                : "Date not recorded"
        ]);
    });

    const csv =
        "\uFEFF" +
        reportRows
            .map(row => row.map(escapeCsv).join(","))
            .join("\r\n");

    const file =
        new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url =
        URL.createObjectURL(file);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = `library-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

}


document
    .getElementById("downloadReportBtn")
    .addEventListener(
        "click",
        downloadReport
    );


// ============================================
// NAVIGATION
// ============================================

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


navItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const section =
                    this.dataset.section;


                // Remove active navigation

                navItems.forEach(
                    nav => {

                        nav.classList
                            .remove("active");

                    }
                );


                this.classList.add(
                    "active"
                );


                // Hide sections

                document
                    .querySelectorAll(
                        ".section"
                    )
                    .forEach(
                        sectionElement => {

                            sectionElement
                                .classList
                                .remove("active");

                        }
                    );


                // Show selected section

                const selectedSection =
                    document.getElementById(
                        section + "Section"
                    );


                if (selectedSection) {

                    selectedSection
                        .classList
                        .add("active");

                }


                // Change page title

                const titles = {

                    dashboard:
                        "Dashboard",

                    books:
                        "Books Management",

                    members:
                        "Members Management",

                    issued:
                        "Issued Books",

                    reports:
                        "Reports",

                    about:
                        "About"

                };


                document
                    .getElementById("pageTitle")
                    .textContent =
                    titles[section];


                // Close mobile sidebar

                document
                    .getElementById("sidebar")
                    .classList
                    .remove("open");

                if (section === "issued") {
                    openIssueModal();
                }

            }
        );

    }
);


// ============================================
// VIEW ALL BOOKS
// ============================================

document
    .getElementById("viewBooksBtn")
    .addEventListener(
        "click",
        function () {

            document
                .querySelector(
                    '[data-section="books"]'
                )
                .click();

        }
    );


// ============================================
// MOBILE SIDEBAR
// ============================================

document
    .getElementById("mobileMenu")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("sidebar")
                .classList
                .toggle("open");

        }
    );


// ============================================
// LOGOUT
// ============================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) return;


            localStorage.removeItem(
                "currentUser"
            );


            alert(
                "You have been logged out."
            );


            window.location.href =
                "../LOGIN/login.html";

        }
    );


// ============================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ============================================

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target === bookModal
        ) {

            bookModal
                .classList
                .remove("show");

        }


        if (
            event.target === memberModal
        ) {

            memberModal
                .classList
                .remove("show");

        }


        if (
            event.target === issueModal
        ) {

            issueModal
                .classList
                .remove("show");

        }

    }
);


// ============================================
// INITIALIZE DASHBOARD
// ============================================

displayUser();

loadBooks();

loadMembers();

loadIssuedBooks();

updateStatistics();

updateStatistics();