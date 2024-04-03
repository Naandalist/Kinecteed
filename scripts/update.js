const updateContactFormElement = document.getElementById("update-data-form");
const goBackLink = document.getElementById("goBackLink");

const toastColors = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "linear-gradient(to right, #00b09b, #96c93d)",
  alert: "#dc3545", // Red
  warning: "#ffc107", // Yellow
};

function showToast(color) {
  Toastify({
    text: `There is no data change`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: color,
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

function loadContactsFromLocalStorage() {
  const storedContactsString = localStorage.getItem("contacts");
  try {
    return JSON.parse(storedContactsString);
  } catch (error) {
    console.error("Error loading contacts from localStorage:", error);
  }
}

function saveContactsToLocalStorage(contacts) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function addContact(event) {
  event.preventDefault();
  const loadedContacts = loadContactsFromLocalStorage();

  console.log("data: ", loadedContacts);

  const id = loadedContacts[loadedContacts.length - 1].id + 1;
  const fullName = addContactFormElement.fullName.value;
  const label = addContactFormElement.label.value;
  const phoneNumber = addContactFormElement.phoneNumber.value;
  const emailAddress = addContactFormElement.emailAddress.value;
  const tag = addContactFormElement.tag.value;

  const newContactData = {
    id,
    fullName,
    label,
    phoneNumber,
    emailAddress,
    tag,
  };

  saveContactsToLocalStorage([...loadedContacts, newContactData]);
}

function filterContactsById(contacts, id) {
  return contacts.filter((contact) => contact.id === Number(id))[0];
}

function updateContact(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);

  const loadedContacts = loadContactsFromLocalStorage();

  //   const selectedContact = filterContactsById(loadedContacts, id);

  //   console.log(loadedContacts);
  //   console.log(id);

  //   console.log("selectedContact: ", selectedContact);

  const id = parseInt(urlParams.get("id"));
  const fullName = updateContactFormElement.fullName.value;
  const label = updateContactFormElement.label.value;
  const phoneNumber = updateContactFormElement.phoneNumber.value;
  const emailAddress = updateContactFormElement.emailAddress.value;
  const tag = updateContactFormElement.tag.value;

  const newContactData = {
    id,
    fullName,
    label,
    phoneNumber,
    emailAddress,
    tag,
  };

  const targetIndex = loadedContacts.findIndex(
    (item) => item.id === newContactData.id
  );

  if (targetIndex !== -1) {
    // Replace the element at the target index with newData

    console.log("Updated data:", loadedContacts);

    console.log("newContactData.fullNam: ", newContactData.fullName);
    console.log("loadedContacts[targetIndex].fullName: ", newContactData.fullName);

    if (loadedContacts[targetIndex].fullName === newContactData.fullName) {
      loadedContacts[targetIndex] = newContactData;
      showToast(toastColors.alert);
    } else {
      saveContactsToLocalStorage(loadedContacts);

      showToast(toastColors.success);
    }
  } else {
    console.error("ID", newContactData.id, "not found in the data");
  }

  // saveContactsToLocalStorage([...loadedContacts, newContactData]);
}

function renderFillInput() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const loadedContacts = loadContactsFromLocalStorage();

  console.log("loadedContacts: ", loadedContacts);

  console.log("id: ", id);

  const selectedContact = filterContactsById(loadedContacts, id);

  console.log("selectedContact: ", selectedContact);

  // Access form elements
  const fullNameInput = document.getElementById("fullName");
  const labelInput = document.getElementById("label");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const emailAddressInput = document.getElementById("emailAddress");
  const tagInput = document.getElementById("tag");

  // Set input values
  fullNameInput.value = selectedContact.fullName;
  labelInput.value = selectedContact.label;
  phoneNumberInput.value = Number(selectedContact.phoneNumber);
  emailAddressInput.value = selectedContact.emailAddress;
  tagInput.value = selectedContact.tag;
}

function goBack() {
  window.location.href = "/";
}

goBackLink.addEventListener("click", goBack);
window.addEventListener("load", renderFillInput);
updateContactFormElement.addEventListener("submit", updateContact);
