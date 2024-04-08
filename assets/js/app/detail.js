const detailsContainer = document.getElementById('details-contact');

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

  detailsContainer.innerHTML =`<div
    class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl bg-clip-border">
    <img class="w-full rounded-t-2xl" src="../assets/img/bg-profile.webp" alt="profile cover image" />
    <div class="flex flex-wrap justify-center -mx-3">
      <div class="max-w-full px-3 flex-0">
        <div class="mb-6 -mt-6 lg:mb-0 lg:-mt-16">
          <a href="javascript:;">
            <img class="h-auto max-w-full border-2 border-white border-solid rounded-circle"
              src="https://ui-avatars.com/api/?background=random&name=${selectedContact.fullName}&size=100"
              alt="profile image ${selectedContact.fullName}" />
          </a>
        </div>
      </div>
    </div>
    <div class="flex-auto p-6 pt-0">
      <div class="mt-6 text-center">
        <h5>
        ${selectedContact.fullName}<span class="font-light">, ${selectedContact.label}</span>
        </h5>
        <div class="mb-2 font-semibold leading-relaxed text-base text-slate-700">
          <i class="mr-2 ni ni-mobile-button"></i>
          ${selectedContact.phoneNumber}
        </div>
        <div class="mt-6 mb-2 font-semibold leading-relaxed text-base  text-slate-700">
          <i class="mr-2 ni ni-email-83"></i>
          ${selectedContact.emailAddress}
        </div>
        <div class="">
          <i class="mr-2  ni ni-tag"></i>
          ${selectedContact.tag}
        </div>
      </div>
    </div>
  </div>`
}

function goBack() {
  window.location.href = "/";
}

goBackLink.addEventListener("click", goBack);
window.addEventListener("load", renderDetail);
