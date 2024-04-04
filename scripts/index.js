const searchInputElement = document.getElementById("search-input");
const addContactFormElement = document.getElementById("add-data-form");
const contactsContainerElement = document.getElementById("contacts-container");
const searchInput = document.getElementById("search-input");

const tableData = document.querySelector(".flex-none.w-full.max-w-full.px-3");
const noDataMessageHidden = document.querySelector(
  ".hidden.w-full.max-w-full.px-3.mb-6.hidden"
);
const noDataMessageNotHidden = document.querySelector(
  ".w-full.max-w-full.px-3.mb-6"
);

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

  const filterBy = params.get("filterBy");

  const filterConditions = {
    work: (item) => item.tag === "work",
    family: (item) => item.tag === "family",
    community: (item) => item.tag === "community",
    favourites: (item) => item.isFavourite === true,
  };

  if (filterConditions[filterBy]) {
    storedContacts = storedContacts.filter(filterConditions[filterBy]);
  }

  // its magic, auto add data 😎
  const autoAddData = params.get("autoAddData");

  if (autoAddData === "on" && storedContacts.length < 15) {
    localStorage.setItem(
      "contacts",
      JSON.stringify([...storedContacts, ...mockDataContact])
    );
    window.location.href = "/";
  }

  if (keyword) {
    searchInputElement.value = keyword;

    const filteredContacts = storedContacts.filter((contact) =>
      contact.fullName.toLowerCase().includes(keyword.toLowerCase())
    );

    storedContacts = filteredContacts;
  }

  // handling data empty
  if (storedContacts?.length < 1 || !storedContacts) {
    tableData.classList.add("hidden");

    if (noDataMessageHidden) noDataMessageHidden.classList.remove("hidden");
  } else {
    tableData.classList.remove("hidden");
    if (noDataMessageNotHidden) noDataMessageNotHidden.classList.add("hidden"); // Make it hidden

    createTableRows(storedContacts.reverse());
  }

  const tagHeading = document.querySelector(
    "h6.pl-6.ml-2.text-xs.font-bold.leading-tight.uppercase.opacity-60"
  );

  // avoid double render button sidebar
  if (!tagHeading) {
    createButtonMenuSidebar();
  }
}

function handleSearch(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (event.key === "Enter") {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", searchTerm);

    const newUrl = `${window.location.origin}${
      window.location.pathname
    }?${urlParams.toString()}`;

    window.location.href = newUrl;
  }
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
    initialContacts = [];
    saveContactsToLocalStorage(initialContacts);
  }
});

function deleteContactById(id) {
  let storedContacts = loadContactsFromLocalStorage();

  const indexToRemove = storedContacts.findIndex(
    (person) => Number(person.id) === id
  );

  if (indexToRemove !== -1) {
    storedContacts.splice(indexToRemove, 1);
  }

  showAlert("warning", "Are you sure want to delete this?");
}

function showAlert(type, message) {
  Swal.fire({
    title: "",
    text: message,
    icon: type,
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      saveContactsToLocalStorage(storedContacts);
      renderContacts();
      if (storedContacts.length < 1) window.location.href = "/";
    }
  });
}

function createTableRows(data) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = ""; // This removes all child elements from table

  const colorMap = {
    family: "from-blue-700 to-cyan-500",
    community: "from-emerald-500 to-teal-400",
    work: "from-orange-500 to-yellow-500",
  };

  data.map((item) => {
    const tableRow = document.createElement("tr");

    // User information cell
    const userInfoCell = document.createElement("td");
    userInfoCell.classList.add(
      "p-2",
      "align-middle",
      "bg-transparent",
      "border-b",
      "dark:border-white/40",
      "whitespace-nowrap",
      "shadow-transparent"
    );
    userInfoCell.innerHTML = `
      <div class="flex px-2 py-1">
        <div>
        <img
          src="https://ui-avatars.com/api/?background=random&name=${
            item.fullName
          }&size=200"
          class="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl"
          alt="user1"
      />
        </div>
        <div class="flex flex-col justify-center">
          <h6 class="mb-0 text-sm leading-normal dark:text-white">${
            item.fullName
          }</h6>
          <p class="mb-0 text-xs leading-tight dark:text-white dark:opacity-80 text-slate-400">${item.label.toLowerCase()}</p>
        </div>
      </div>
    `;
    tableRow.appendChild(userInfoCell);

    // Phone number cell
    const phoneCell = document.createElement("td");
    phoneCell.classList.add(
      "p-2",
      "text-center",
      "align-middle",
      "bg-transparent",
      "border-b",
      "dark:border-white/40",
      "whitespace-nowrap",
      "shadow-transparent"
    );
    const maskedPhone = item.phoneNumber.replace(/(\+\d{4}).{2}/, '$1**');
    phoneCell.innerHTML = `<span class="text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">${maskedPhone}</span>`;
    tableRow.appendChild(phoneCell);

    // Email address cell
    const emailCell = document.createElement("td");
    emailCell.classList.add(
      "p-2",
      "text-center",
      "align-middle",
      "bg-transparent",
      "border-b",
      "dark:border-white/40",
      "whitespace-nowrap",
      "shadow-transparent"
    );
    emailCell.innerHTML = `<span class="text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">${item.emailAddress}</span>`;
    tableRow.appendChild(emailCell);

    // Tag cell
    const tagCell = document.createElement("td");
    tagCell.classList.add(
      "p-2",
      "align-middle",
      "text-sm",
      "leading-normal",
      "text-center",
      "align-middle",
      "bg-transparent",
      "border-b",
      "dark:border-white/40",
      "whitespace-nowrap",
      "shadow-transparent"
    );
    tagCell.innerHTML = `<span class="py-1.4 px-2.5 text-xs rounded-1.8 inline-block whitespace-nowrap text-center bg-gradient-to-tl ${colorMap[item.tag]} align-baseline font-bold uppercase leading-none text-white">${
      item.tag
    }</span>`;

    tableRow.appendChild(tagCell);

    // Actions cell
    const actionsCell = document.createElement("td");
    actionsCell.classList.add(
      "p-2",
      "align-middle",
      "bg-transparent",
      "border-b",
      "dark:border-white/40",
      "whitespace-nowrap",
      "shadow-transparent"
    );
    actionsCell.innerHTML = `
    <div class="ml-auto text-right">
      <a
      class="inline-block dark:text-white px-4 py-2.5 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 hover:-translate-y-px active:opacity-85 bg-x-25 text-slate-700"
      href="/pages/detail.html?id=${item.id}"
      ><i
        class="mr-2 fas fa-eye text-slate-700"
        aria-hidden="true"
      ></i
      >Details</a
    >
    <a
      class="inline-block dark:text-white px-4 py-2.5 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 hover:-translate-y-px active:opacity-85 bg-x-25 text-slate-700"
      href="/pages/update.html?id=${item.id}"
      ><i
        class="mr-2 fas fa-pencil-alt text-slate-700"
        aria-hidden="true"
      ></i
      >Edit</a
    >
    <button
      class="relative z-10 inline-block px-4 py-2.5 mb-0 font-bold text-center text-transparent align-middle transition-all border-0 rounded-lg shadow-none cursor-pointer leading-normal text-sm ease-in bg-150 bg-gradient-to-tl from-red-600 to-orange-600 hover:-translate-y-px active:opacity-85 bg-x-25 bg-clip-text"
      href="javascript:;" onclick="deleteContactById(${item.id})"
      ><i
        class="mr-2 far fa-trash-alt bg-150 bg-gradient-to-tl from-red-600 to-orange-600 bg-x-25 bg-clip-text"
      ></i
      >Delete</button
    >
  </div>                       
  `;
    tableRow.appendChild(actionsCell);

    tableBody.appendChild(tableRow);
  });
}

function createButtonMenuSidebar() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("filterBy");

  const isButtonMenuActive = (category) => {
    if (category === "allContact" && !selectedCategory) return "bg-blue-500/13";
    return selectedCategory === category ? "bg-blue-500/13" : "";
  };

  const ulElement = document.querySelector("ul.flex.flex-col.pl-0.mb-0");
  const childElement = `<li class="mt-0.5 w-full">
    <a class="py-2.7 ${isButtonMenuActive(
      "allContact"
    )} text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
      href="/">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
        <i class="relative top-0 text-sm leading-normal text-blue-500 ni ni-collection"></i>
      </div>
      <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">All Contacts</span>
    </a>
  </li>
  <li class="mt-0.5 w-full">
    <a class="py-2.7 ${isButtonMenuActive(
      "favourites"
    )} text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors"
      href="/?filterBy=favourites">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
        <i class="relative top-0 text-sm leading-normal text-red-500 ni ni-favourite-28"></i>
      </div>
      <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Favourites</span>
    </a>
  </li>
  <hr class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
  <li class="w-full mt-4">
    <h6 class="pl-6 ml-2 text-xs font-bold leading-tight uppercase opacity-60">
      Tags
    </h6>
  </li>
  <li class="mt-0.5 w-full">
    <a class="py-2.7 ${isButtonMenuActive(
      "work"
    )} text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
      href="/?filterBy=work">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
        <i class="relative top-0 text-sm leading-normal text-orange-500 ni ni-tag"></i>
      </div>
      <span class="ml-1 duration-300 opacity-100 pointer-events-none ease text-orange-500">Work</span>
    </a>
  </li>
  <li class="mt-0.5 w-full">
    <a class="py-2.7 ${isButtonMenuActive(
      "community"
    )} text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
      href="/?filterBy=community">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
        <i class="relative top-0 text-sm leading-normal text-emerald-500 ni ni-tag"></i>
      </div>
      <span class="ml-1 duration-300 opacity-100 pointer-events-none ease text-emerald-500">Community</span>
    </a>
  </li>
  <li class="mt-0.5 w-full">
    <a class="py-2.7 ${isButtonMenuActive(
      "family"
    )} text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
      href="/?filterBy=family">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
        <i class="relative top-0 text-sm leading-normal text-blue-500 ni ni-tag"></i>
      </div>
      <span class="ml-1 duration-300 opacity-100 pointer-events-none ease text-blue-500">Family</span>
    </a>
  </li> `;
  ulElement.innerHTML += childElement;
}

window.addEventListener("load", renderContacts);
searchInput.addEventListener("keyup", handleSearch);
