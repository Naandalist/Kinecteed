const searchInputElement = document.getElementById("search-input");
const addContactFormElement = document.getElementById("add-contact-form");
const contactsContainerElement = document.getElementById("contacts-container");

function loadContactsFromLocalStorage() {
  const storedContactsString = localStorage.getItem("contacts");
  try {
    return JSON.parse(storedContactsString);
  } catch (error) {
    console.error("Error loading contacts from localStorage:", error);
  }
}

function renderContacts() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const keyword = params.get("q");

  let storedContacts = loadContactsFromLocalStorage();

  if (keyword) {
    searchInputElement.value = keyword;

    const filteredContacts = storedContacts.filter((contact) =>
      contact.fullName.toLowerCase().includes(keyword.toLowerCase())
    );

    storedContacts = filteredContacts;
  }

  console.log(storedContacts);

  const contactItemElements = storedContacts.map(
    (contact) => `<li>
    <h2>${contact.fullName}</h2>
    <p>${contact.email}</p>
    <p>${contact.phone}</p>
    <div>
      <button onclick="deleteContactById(${contact.id})">Delete</button>
      <button onclick="updateContactById(${contact.id})">Update</button>
    </div>
  </li>
  `
  );
  const contactItems = contactItemElements.join("");
  contactsContainerElement.innerHTML = contactItems;
}

function saveContactsToLocalStorage(contacts) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

window.addEventListener("load", () => {
  const loadedContacts = loadContactsFromLocalStorage();

  if (
    !loadedContacts ||
    !localStorage.getItem("contacts") ||
    loadedContacts.length < 1
  ) {
    initialContacts = [
      {
        id: 1,
        fullName: "Nanda Apriliawan",
        phone: "+62851**941779",
        email: "naandalist@outlook.com",
      },
      {
        id: 2,
        fullName: "Alexander Letirer",
        phone: "+0011**19138",
        email: "alexander.letirer@gmail.com",
      },
      {
        id: 3,
        fullName: "Karl Marx",
        phone: "+004567**890",
        email: "karl_marx@yahoo.com",
      },
    ];
    saveContactsToLocalStorage(initialContacts);
  }

  renderContacts(); // Render after loading data
});

function addContact(event) {
  event.preventDefault();
  const loadedContacts = loadContactsFromLocalStorage();

  const contactFormData = new FormData(addContactFormElement);
  const newContact = {
    id: loadedContacts[loadedContacts.length - 1].id + 1,
    fullName: contactFormData.get("fullName"),
    email: contactFormData.get("email"),
    phone: contactFormData.get("phone"),
  };

  loadedContacts.push(newContact);
  saveContactsToLocalStorage(loadedContacts);
  renderContacts();
}

function deleteContactById(id) {
  const loadedContacts = loadContactsFromLocalStorage();
  const updatedContacts = loadedContacts.filter(
    (contact) => contact.id !== Number(id)
  );

  saveContactsToLocalStorage(updatedContacts);
  renderContacts();
}

function updateContactById(id) {
  const loadedContacts = loadContactsFromLocalStorage();

  const updatedContacts = loadedContacts.map((contact) => {
    if (contact.id === Number(id)) {
      const updatedContact = {
        ...contact,
        fullName: addContactFormElement.fullName.value,
        email: addContactFormElement.email.value,
        phone: addContactFormElement.phone.value,
      };
      return updatedContact;
    } else {
      return contact;
    }
  });

  saveContactsToLocalStorage(updatedContacts);
  renderContacts();
}

window.addEventListener("load", renderContacts);

addContactFormElement.addEventListener("submit", addContact);
