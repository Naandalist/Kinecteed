const updateContactFormElement = document.getElementById("update-data-form");
const goBackLink = document.getElementById("goBackLink");
const tagCheckboxContainer = document.getElementById("tag-checkbox-container");
const checkboxContainer = document.querySelector(
  ".min-h-6.pl-7.flex.justify-between"
);

const toastColors = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "linear-gradient(to right, #00b09b, #96c93d)",
  alert: "#dc3545", // Red
  warning: "#ffc107", // Yellow
};

function showToast(color, message) {
  Toastify({
    text: message || `Sometthing went wrong!`,
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

function filterContactsById(contacts, id) {
  return contacts.filter((contact) => contact.id === Number(id))[0];
}

function updateContact(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);

  const loadedContacts = loadContactsFromLocalStorage();

  function checkedValue() {
    const checkboxes = document.getElementsByName("tag");
    return Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  const tag = checkedValue()[0];
  const id = parseInt(urlParams.get("id"));
  const fullName = updateContactFormElement.fullName.value;
  const label = updateContactFormElement.label.value;
  const phoneNumber = updateContactFormElement.phoneNumber.value;
  const emailAddress = updateContactFormElement.emailAddress.value;
  const isFavourite = document.getElementById("favourite").checked;

  console.log("FAV: ");

  const newContactData = {
    id,
    fullName,
    label,
    phoneNumber,
    emailAddress,
    tag,
    isFavourite,
  };

  const targetIndex = loadedContacts.findIndex(
    (item) => item.id === newContactData.id
  );

  if (targetIndex !== -1) {
    if (
      JSON.stringify(loadedContacts[targetIndex]) ===
      JSON.stringify(newContactData)
    ) {
      // loadedContacts[targetIndex] = newContactData;
      console.log("data ga berubah");
      showToast(toastColors.alert, "There is no updated");
    } else {

      // replace by new updated data 
      loadedContacts[targetIndex] = newContactData;

      saveContactsToLocalStorage(loadedContacts);

      showToast(toastColors.success, "Data updated successfully");
    }
  } else {
    console.error("ID", newContactData.id, "not found in the data");
  }
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

  //handling switch favorite
  const switchFavouriteInput = document.getElementById("favourite");

  console.log("selectedContact.isFavourite: ", selectedContact.isFavourite);

  if (selectedContact.isFavourite) {
    switchFavouriteInput.checked = true;
  }

  //handling checked status for tag input
  const tagCommunityInput = document.getElementById("tag-community");
  const tagWorkInput = document.getElementById("tag-work");
  const tagFamilyInput = document.getElementById("tag-family");

  if (selectedContact.tag === "community") {
    tagCommunityInput.checked = true;
  }

  if (selectedContact.tag === "work") {
    tagWorkInput.checked = true;
  }

  if (selectedContact.tag === "family") {
    tagFamilyInput.checked = true;
  }

  // Set input values
  fullNameInput.value = selectedContact.fullName;
  labelInput.value = selectedContact.label;
  phoneNumberInput.value = selectedContact.phoneNumber;
  emailAddressInput.value = selectedContact.emailAddress;

  //set active tag checkbox
  // renderTagCheckbox(selectedContact.tag);
}

function handleCheckbox(event) {
  const clickedCheckbox = event.target;
  if (
    clickedCheckbox.tagName !== "INPUT" ||
    !clickedCheckbox.type === "checkbox"
  )
    return;

  const allCheckboxes = checkboxContainer.querySelectorAll(
    'input[type="checkbox"]'
  );

  allCheckboxes.forEach((checkbox) => {
    if (checkbox !== clickedCheckbox) {
      checkbox.checked = false;
    }
  });
}

function goBack() {
  window.location.href = "/";
}

goBackLink.addEventListener("click", goBack);
window.addEventListener("load", renderFillInput);
updateContactFormElement.addEventListener("submit", updateContact);
checkboxContainer.addEventListener("click", handleCheckbox);
