function loadContactsFromLocalStorage() {
  const storedContactsString = localStorage.getItem("contacts");
  try {
    return JSON.parse(storedContactsString);
  } catch (error) {
    console.error("Error loading contacts from localStorage:", error);
  }
}

function filterContactsById(contacts, id) {
  return contacts.filter((contact) => contact.id === Number(id))[0];
}

function renderDetail() {
  const urlParams = new URLSearchParams(window.location.search);

  const id = parseInt(urlParams.get("id"));
  const storedContacts = loadContactsFromLocalStorage();

  const selectedContact = filterContactsById(storedContacts, id);

  console.log("selectedContact: ", selectedContact)
}

function goBack() {
  window.location.href = "/";
}

goBackLink.addEventListener("click", goBack);
window.addEventListener("load", renderDetail);
