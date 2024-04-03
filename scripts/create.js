const addContactFormElement = document.getElementById("add-data-form");
const goBackLink = document.getElementById("goBackLink");
const checkboxContainer = document.querySelector(
  ".min-h-6.pl-7.flex.justify-between"
);

const toastColors = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "linear-gradient(to right, #00b09b, #96c93d)",
  alert: "#dc3545", // Red
  warning: "linear-gradient(to right, #d35400, #f39c12)",
};

function showToast(color, text) {
  Toastify({
    text: text || `a message`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: color,
    },
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

function checkedValue() {
  const checkboxes = document.getElementsByName("tag");
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function addContact(event) {
  event.preventDefault();
  const loadedContacts = loadContactsFromLocalStorage();

  console.log("data: ", loadedContacts);

  const id = loadedContacts[loadedContacts.length - 1]?.id
    ? loadedContacts[loadedContacts.length - 1]?.id + 1
    : 0 + 1;
  const fullName = addContactFormElement.fullName.value;
  const label = addContactFormElement.label.value;
  const phoneNumber = addContactFormElement.phoneNumber.value;
  const emailAddress = addContactFormElement.emailAddress.value;
  const tag = checkedValue()[0];

  const contactData = {
    id,
    fullName,
    label,
    phoneNumber,
    emailAddress,
    tag,
  };

  console.log("TAG: ", tag);
  if (!tag) {
    showToast(toastColors.warning, `Tag is required!`);
    return;
  }

  const isFullNameAlreadyExist = loadedContacts.some(
    (contact) => contact.fullName === fullName
  );
  const isPhoneNumberAlreadyExist = loadedContacts.some(
    (contact) => contact.phoneNumber === phoneNumber
  );

  if (isFullNameAlreadyExist) {
    showToast(toastColors.alert, `${fullName} is already exist`);
    return;
  }
  if (isPhoneNumberAlreadyExist) {
    showToast(toastColors.alert, `Phone number is already exist`);
    return;
  }

  saveContactsToLocalStorage([...loadedContacts, contactData]);

  //reset all field values
  const inputs = addContactFormElement.querySelectorAll(
    'input[type="text"], input[type="tel"], input[type="email"]'
  );
  inputs.forEach((input) => {
    input.value = "";
  });

  // Uncheck all checkbox
  const checkboxes = addContactFormElement.querySelectorAll(
    'input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  showToast(toastColors.success, "New data has created successfully");
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

addContactFormElement.addEventListener("submit", addContact);

goBackLink.addEventListener("click", goBack);

checkboxContainer.addEventListener("click", handleCheckbox);
