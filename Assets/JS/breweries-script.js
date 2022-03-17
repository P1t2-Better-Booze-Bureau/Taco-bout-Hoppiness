var breweryTable = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
var menuModal = document.getElementById(`menuModal`);
var saveBtn = document.getElementById(`saveBtn`);
var cancelBtnEl = document.querySelector(`#cancelBtn`);
// Documenu Geo API / Needs fresh key for demonstration

// Used Miguel's key for testing brewery layout to reduce unnecessary pulls
var documentApiList = ["f2891f69c0b5f586001e03d7f04150cd"];
var documenuApi =
  "https://api.documenu.com/v2/restaurants/search/geo?key=5c84bf0ba620e31313ba63c7c9b54297&cuisine=Mexican&distance=2&fullmenu";
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=1d72ed71331751f36558c92ff7f8a0cf&cuisine=Mexican&distance=2&fullmenu";
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=e59184fab7b4752cf7593f7ca4a627f1&cuisine=Mexican&distance=2&fullmenu";
// additional key: 442e928049c9bb7b553d48b27474017a - Miguel
// 5c84bf0ba620e31313ba63c7c9b54297
// KEY FOR DEMO: bb8246f243790c635ad142fe7f2030ba
//another one for demo: aeb59f84ae3c5fc239e52dd74a168c50
var zipCodeVariable = "";
var coordinate = [];
var localStorageTest = localStorage.getItem(`tacoTest`);

if (localStorageTest === null) {
  localStorageTest = "";
} else {
  localStorageTest = JSON.parse(localStorageTest);
  console.log(localStorageTest);
}
// Get hoppiness button event listener
buttonClick.addEventListener("click", geocode);

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var openBreweryDBUrl =
    "https://api.openbrewerydb.org/breweries?per_page=10&by_dist=";

  openBreweryDBUrl += `${coordinate[0]},${coordinate[1]}`;

  // Clear cards when completing an additional search
  breweryTable.innerHTML = "";
  fetch(openBreweryDBUrl)
    .then(function (response) {
      return response.json();
    })
    // loop to add data to table

    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        let template = `
        <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400 bg-auto bg-[url('./Assets/pictures/BeerSuds.jpg')]">
      <div class="py-2.5 px-2.5 text-left justify-between brewCard">
      
      <div class="font-bold text-xl mb-2">${data[i].name}</div>
      <p class="text-gray-700 text-left text-base"> Address: <br>
      ${data[i].street} <br>
      <span>${data[i].city},
      ${data[i].state}</span><br>
      <span> ${data[i].postal_code}</span>
          </p>
          <br>`;
        if (data[i].website_url != null) {
          template += websiteAdd(data[i].website_url);
        }

        template += `<br>
          <div class="invisible" id="brewLat">${data[i].latitude}</div>
          <div class="invisible" id="brewLon">${data[i].longitude}</div>
         
          <span class="inline-block bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-0 border-2 border-black">${data[i].brewery_type}</span>
          </div>
          </div>            `;
        breweryTable.innerHTML += template;
      }
      // Brewery card event listener to search for tacos
      var cardEl = document.getElementsByClassName(`brewCard`);
      console.log(cardEl);
      for (let i = 0; i < cardEl.length; i++) {
        cardEl[i].addEventListener(`click`, getTaco);
      }
    });
}

// Starting on submit function when the enter key is hit while in the Zip Code area
// zipCode.addEventListener("keyup", (event) => {
//   if(event.keyCode === 13); {
//     event.preventDefault();
//     console.log("enter hit")
//   }
// });

// Function to pull geolocation from user zip code
function geocode() {
  var leftBrewHidden = document.getElementById("brewButtonLeft");
  var rightBrewHidden = document.getElementById("brewButtonRight");
  var brewBannerSubmit = document.getElementById("brewBanner");
  leftBrewHidden.classList.remove("hidden");
  rightBrewHidden.classList.remove("hidden");
  brewBannerSubmit.classList.add("hidden");
  zipCodeVariable = document.getElementById("zipCode").value;
  var openWeatherApi = `https://api.openweathermap.org/geo/1.0/zip?appid=d20682e8d5e2100a9c4e1e2f42e32a85&zip=${zipCodeVariable},US`;

  fetch(openWeatherApi).then(function (response) {
    console.log(response);
    if (response.status === 200) {
      response.json().then(function (data) {
        coordinate = [data.lat, data.lon];
        findHoppiness(coordinate);
      });
    } else {
      console.log(`error ${response.status}`);
    }
  });
}

// Function to pull Mexican food from geolocation of brewery card selection
function getTaco() {
  // Scroll Bars

  // Clear table every time
  tacoTable.innerHTML = "";
  var documenuUrl = `${documenuApi}&lat=${this.querySelector(`#brewLat`).innerHTML}&lon=${this.querySelector(`#brewLon`).innerHTML}`;
  if (localStorageTest === "") {
    fetch(documenuUrl)
      .then(function (response) {
        return response.json();
      })

      .then(function (tacoData) {
        var leftTacoHidden = document.getElementById("tacoButtonLeft");
        var rightTacoHidden = document.getElementById("tacoButtonRight");
        var tacoBannerSubmit = document.getElementById("tacoBanner");
        leftTacoHidden.classList.remove("hidden");
        rightTacoHidden.classList.remove("hidden");
        tacoBannerSubmit.classList.add("hidden");
        console.log(tacoData);
        localStorageTest = tacoData;
        window.localStorage.setItem(
          `tacoTest`,
          JSON.stringify(localStorageTest)
        );
        for (var i = 0; i < tacoData.data.length; i++) {
          let tacoCardTemplate = `
          <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400">
          <div class="py-2.5 px-2.5 bg-[url('./Assets/pictures/Tacos.jpg')] tacoCard">
          <div class="font-bold text-xl mb-2">${tacoData.data[i].restaurant_name}</div>s
          <p class="text-gray-700 text-base"> Address: 
          ${tacoData.data[i].address.formatted}
            </p>
            <br>`;
          if (tacoData.data[i].restaurant_website != null) {
            tacoCardTemplate += websiteAdd(tacoData.data[i].restaurant_website);
          }
          tacoCardTemplate += `<br><button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded tacoMenu">
            Taco Menu
           </button>
           </div>
           </div>            `;
          tacoTable.innerHTML += tacoCardTemplate;
        }
        var menuButtonEl = document.getElementsByClassName(`tacoMenu`);
        for (let i = 0; i < menuButtonEl.length; i++) {
          menuButtonEl[i].addEventListener(`click`, getTacoMenu(tacoData));
        }
      });
  } else {
    for (var i = 0; i < localStorageTest.data.length; i++) {
      let tacoCardTemplate = `
      <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400">
      <div class="py-2.5 px-2.5 bg-[url('./Assets/pictures/Tacos.jpg')] tacoCard">
      <div class="font-bold text-xl mb-2">${localStorageTest.data[i].restaurant_name}</div>
      <p class="text-gray-700 text-base"> Address: ${localStorageTest.data[i].address.formatted}</p><br>`;
      if (localStorageTest.data[i].restaurant_website != null) {
        tacoCardTemplate += websiteAdd(
          localStorageTest.data[i].restaurant_website
        );
      }
      tacoCardTemplate += `<br><button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded tacoMenuBtn">
        Taco Menu</button>
       </div>
       </div>            `;
      tacoTable.innerHTML += tacoCardTemplate;
    }
    var menuButtonEl = document.getElementsByClassName(`tacoMenuBtn`);
    console.log(menuButtonEl);
    for (let i = 0; i < menuButtonEl.length; i++) {
      menuButtonEl[i].addEventListener(`click`, getTacoMenu(localStorageTest));
    }
  }
}
// Add menu functionality to getTaco menu button
//  <button class="btn btn-red bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-8">
//   ${tacoData.data[i].menus}
//   </button>

function websiteAdd(data) {
  // Figure out how to wrap website text when smaller screen size
  let websiteTemplate = `
  <a href=${data} target="_blank" class="blue-300 underline hover:decoration-2">${data}</a>`;
  return websiteTemplate;
}

function toggleModal() {
  menuModal.classList.toggle(`invisible`);
  menuModal.classList.toggle(`visible`);
}

function getTacoMenu(apiData) {
  // Add JS to pull taco items from object within menu, and display taco menu within #tacoMenuList
  for (let i = 0; i < apiData.data.length; i++) {
    console.log(apiData.data[i].menus);
  }
  toggleModal();
  console.log(`Taco Menu was clicked`);
}

cancelBtnEl.addEventListener(`click`, toggleModal);

// Make saveBtn save both brewery and taco location objects in to local storage
