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
// console.log(cardsContainer);

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

  let inputs = document.querySelectorAll("form input");
  inputs.forEach((elem) => {
    elem.value = "";
  });
}

// Read - displaing the data
async function readProfile() {
  let res = await fetch(API);
  let data = await res.json();
  // cardsContainer.innerHTML = "";
  data.forEach((a, id) => {
    cardsContainer.innerHTML += `
        <div class="card-profile">
          <img src="${a.image}" alt="#" />
          <h4>${a.name}</h4>
          <span>$${a.price}</span>
        </div>
        <button onclick="deleteProfile(${id})">delete</button>`;
    // console.log(a);
  });
}
readProfile();

async function deleteProfile(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
