const API_URL = 'https://jsonplaceholder.typicode.com/users';
let localContacts = []; // Store contacts locally

// Fetch and display all contacts
async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        localContacts = await response.json();
        console.log(localContacts) // Store contacts locally
        displayContacts(localContacts);
    } catch (error) {
        showError('Failed to fetch contacts: ' + error.message);
    }
}

// Display contacts in the UI
function displayContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <span class="d-flex gap-3 justify-content-center align-items-center"><img src="../user.png" alt="phone-img" height="40px"/>${contact.name} - ${contact.phone}</span>
            <div>
                <button class="btn btn-edit btn-sm me-2" onclick="editContact('${contact.id}', '${contact.name}', '${contact.phone}')">Edit</button>
                <button class="btn btn-delete btn-sm" onclick="deleteContact('${contact.id}')">Delete</button>
            </div>
        `;
        contactList.appendChild(div);
    });
}

// Save contact (create or update)
async function saveContact() {
    const id = document.getElementById('contactId').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!name || !phone) {
        showError('Please fill in all fields');
        return;
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone })
        });

        if (!response.ok) throw new Error('Failed to save contact');

        // Simulate adding/updating locally
        if (method === 'POST') {
            const newContact = { id: Date.now(), name, phone }; // Simulate new ID
            localContacts.push(newContact);
        } else {
            localContacts = localContacts.map(contact =>
                contact.id === parseInt(id) ? { ...contact, name, phone } : contact
            );
        }

        clearForm();
        displayContacts(localContacts); // Update UI with local data
    } catch (error) {
        showError('Failed to save contact: ' + error.message);
    }
}

// Edit contact
function editContact(id, name, phone) {
    document.getElementById('contactId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('phone').value = phone;
}

// Delete contact
async function deleteContact(id) {
    console.log('Deleting contact ID:', id);
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete contact');

        // Remove contact from local array
        localContacts = localContacts.filter(contact => contact.id !== parseInt(id));
        console.log('Remaining contacts:', localContacts);
        displayContacts(localContacts); // Update UI with local data
    } catch (error) {
        showError('Failed to delete contact: ' + error.message);
    }
}

// Search contacts
function searchContacts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredContacts = localContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm)
    );
    displayContacts(filteredContacts);
}

// Clear form
function clearForm() {
    document.getElementById('contactId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    setTimeout(() => errorDiv.textContent = '', 3000);
}

// Initial fetch of contacts
fetchContacts();