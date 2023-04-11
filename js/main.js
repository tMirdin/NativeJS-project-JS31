// Сохраняем в переменные все инпуты для ввода данных и кнопку "Создать"
let inpName = document.getElementById("inpName");
let inpImg = document.getElementById("inpImg");
let inpNumber = document.getElementById("inpNumber");
let inpSkills = document.getElementById("inpSkills");
let inpPrice = document.getElementById("inpPrice");
let btnCreate = document.getElementById("btnCreate");
const API = "http://localhost:8000/profiles";
let form = document.querySelector("form");
let cardsContainer = document.querySelector(".cards-container");
let detailsModal = document.querySelector("#modal");
let inpSearch = document.querySelector("#inpSearch");
// let searchValue = "";

// Навешиваем событие submit на тег Form, для того, чтобы собрать значения инпутов в один объект и отрпавить их в db.json

form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   Проверка на заполненность полей
  if (
    !inpName.value.trim() ||
    !inpImg.value.trim() ||
    !inpNumber.value.trim() ||
    !inpSkills.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  //   Создаём новый объект и туда добавляем значения наших инпутов
  let newProfile = {
    name: inpName.value,
    image: inpImg.value,
    number: inpNumber.value,
    skills: inpSkills.value,
    price: inpPrice.value,
  };
  createProfile(newProfile);
});

// Create - добавление новых данных
async function createProfile(objProf) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objProf),
  });

  readProfile();

  let inputs = document.querySelectorAll("form input");
  inputs.forEach((elem) => {
    elem.value = "";
  });
}

// Read - отображение данных
async function readProfile(search = "") {
  let res = await fetch(`${API}?q=${search}`);
  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
    <div class="card-profile">
          <img src="${elem.image}" alt="${elem.name}" onclick="showDetailsModal()"/>
          <h4>${elem.name}</h4>
          <span>$${elem.price}</span>
          <button onclick="deleteProfile(${elem.id})">delete</button>
          <button onclick="showModalEdit(${elem.id})">edit</button>
        </div>
    `;
  });
}
readProfile();

// Delete - удаление одного элемента по id

async function deleteProfile(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProfile();
}

// ! Edit
// let editBtns = document.querySelector(".btnEdit");
let modal = document.querySelector(".editModal");
let closeBtn = document.querySelector("#closeEditModal");
let editInpName = document.querySelector("#editInpName");
let editInpImage = document.querySelector("#editInpImage");
let editInpNumber = document.querySelector("#editInpNumber");
let editInpDesc = document.querySelector("#editInpDesc");
let editInpPrice = document.querySelector("#editInpPrice");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector("#editForm button");

async function showModalEdit(id) {
  modal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  console.log(data);
  editInpName.value = data.name;
  editInpImage.value = data.image;
  editInpNumber.value = data.number;
  editInpDesc.value = data.skills;
  editInpPrice.value = data.price;
  btnSave.setAttribute("id", data.id);
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let editedProfile = {
    name: editInpName.value,
    image: editInpImage.value,
    number: editInpNumber.value,
    skills: editInpDesc.value,
    price: editInpPrice.value,
  };
  console.log(btnSave.id);
  editProfileFunc(editedProfile, btnSave.id);
});

async function editProfileFunc(editedProfile, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedProfile),
    });
    modal.style.display = "none";
    readProfile();
  } catch (error) {
    console.error(error);
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ! Details - детальное отображение данных

function showDetailsModal() {
  detailsModal.style.display = "flex";
}

// ! ============== Seacrh =============
inpSearch.addEventListener("input", (e) => {
  // console.log(e.target.value);
  // searchValue = e.target.value;
  readProfile(e.target.value);
});
