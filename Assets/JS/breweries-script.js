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

var breweryTable = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
var menuModal = document.getElementById(`menuModal`);
var saveBtn = document.getElementById(`saveBtn`);
var cancelBtnEl = document.querySelector(`#cancelBtn`);
var zipCodeInput = document.getElementById("zipCode");
var zipCodeVariable = "";
var coordinate = [];
var brewIndex = "";
var tacoIndex = "";
var breweryApiData = "";
var tacoApiData = "";
// Pull & validate from localstorage user favorites
var favorites = localStorage.getItem(`favorites`);
if (favorites === null) {
  favorites = {brewery: [], tacos: [],};
} else {
  favorites = JSON.parse(favorites);
  console.log(favorites);
}

// Test Object from documenu API
var localStorageTest = localStorage.getItem(`tacoTest`);
if (localStorageTest === null) {
  localStorageTest = "";
} else {
  localStorageTest = JSON.parse(localStorageTest);
  console.log(localStorageTest);
}

// Stops the tumbleweeds from being displayed on the screen
// document.getElementById("submitButton").onclick = function (event) {
//   document.getElementById("tumbleweed").className = "hidden";
// };

// Starts function on enter key being hit in the input section
zipCodeInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    console.log("enter");
    geocode();
  }
});

// Start on button click
buttonClick.addEventListener("click", geocode);

// document.getElementById('submitButton').onclick = function(event) {

//   document.getElementById('brewBanner').className = "show";
// }

// Function to pull geolocation from user zip code
function geocode() {
  var leftBrewHidden = document.getElementById("brewButtonLeft");
  var rightBrewHidden = document.getElementById("brewButtonRight");
  var brewBannerSubmit = document.getElementById("brewBanner");
  var tumbleweed = document.getElementById("tumbleweed");
  leftBrewHidden.classList.remove("hidden");
  rightBrewHidden.classList.remove("hidden");
  brewBannerSubmit.classList.add("hidden");
  // tumbleweed.classList.add("hidden");
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

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var openBreweryDBUrl =
    "https://api.openbrewerydb.org/breweries?per_page=10&by_dist=";

  openBreweryDBUrl += `${coordinate[0]},${coordinate[1]}`;

  // Clear cards when completing an additional search
  breweryTable.innerHTML = "";

  // Fetch from API
  fetch(openBreweryDBUrl)
    .then(function (response) {
      return response.json();
    })

    // loop to add data to table
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        breweryApiData = data;
        let template = `
        <div class="rounded-2xl overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 shadow-2xl z-10 bg-cover bg-[url('./Assets/pictures/BeerSuds.jpg')] font-['Bungee_Inline']">

          <div class="py-2.5 px-2.5 text-left justify-between hover:bg-indigo-400 hover:bg-opacity-50 w-72 text-left brewCard">

            <div class="font-extrabold text-xl h-1/4 mb-2">${data[i].name}</div>
            <p class="text-black font-semibold text-left text-base"> Address: <br>
            ${data[i].street} <br>
            ${data[i].city}, ${data[i].state}<br>
            ${data[i].postal_code}</p><br>`;
        if (data[i].website_url != null) {
          template += websiteAdd(data[i].website_url);
        }

        template += `<br>
            <div class="invisible h-1" id="brewLat">${data[i].latitude}</div>
            <div class="invisible h-1" id="brewLon">${data[i].longitude}</div>
          
            <div class="inline-block bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-0 border-2 border-black">${data[i].brewery_type}</div>
            <div class="invisible h-1" id="brewIndex">${i}</div>
          </div>
        </div>`;

        breweryTable.innerHTML += template;
      }

      // Brewery card event listener to search for tacos
      var cardEl = document.getElementsByClassName(`brewCard`);
      for (let i = 0; i < cardEl.length; i++) {
        cardEl[i].addEventListener(`click`, getTaco);
      }
    });
}

// Function to pull Mexican food from geolocation of brewery card selection
function getTaco() {
  // Scroll Bars

  // Clear table every time
  tacoTable.innerHTML = "";
  // Adds lat and lon to documenuApi based on card selected.
  var documenuUrl = `${documenuApi}&lat=${this.querySelector(`#brewLat`).innerHTML}&lon=${this.querySelector(`#brewLon`).innerHTML}`;
  // Saves index of brewery card selected
  brewIndex = this.querySelector(`#brewIndex`).innerHTML;
  console.log(brewIndex);
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
        tacoBannerSubmit.classList.add("show");
        // Saves API pull into global scope variable
        tacoApiData = tacoData;
        localStorageTest = tacoData;
        window.localStorage.setItem(`tacoTest`, JSON.stringify(localStorageTest));
        for (var i = 0; i < tacoData.data.length; i++) {
          let tacoCardTemplate = `
          <div class="rounded-2xl overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 shadow-2xl bg-cover bg-[url('./Assets/pictures/Tacos.jpg')]">
            <div class="py-2.5 px-2.5 tacoCard">

              <div class="font-bold text-xl mb-2">${tacoData.data[i].restaurant_name}</div>

              <p class="bg-amber-700 text-slate-100 text-base"> Address: 
              ${tacoData.data[i].address.formatted}</p><br>`;

          if (tacoData.data[i].restaurant_website != null) {
            tacoCardTemplate += websiteAdd(tacoData.data[i].restaurant_website);
          }

          tacoCardTemplate += `<br>
              <button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded tacoMenu">
                Taco Menu
              </button>
              </div>
           </div>`;
          tacoTable.innerHTML += tacoCardTemplate;
        }

        // Taco Menu Button
        var menuButtonEl = document.getElementsByClassName(`tacoMenu`);
        for (let i = 0; i < menuButtonEl.length; i++) {
          menuButtonEl[i].addEventListener(`click`, getTacoMenu);
        }
      });
  } else {
    for (var i = 0; i < localStorageTest.data.length; i++) {
      // Scroll Feature
      var leftTacoHidden = document.getElementById("tacoButtonLeft");
      var rightTacoHidden = document.getElementById("tacoButtonRight");
      var tacoBannerSubmit = document.getElementById("tacoBanner");
      leftTacoHidden.classList.remove("hidden");
      rightTacoHidden.classList.remove("hidden");
      tacoBannerSubmit.classList.add("hidden");
      // Saves API pull into global scope variable
      tacoApiData = localStorageTest.data;
      let tacoCardTemplate = `
      <div class="rounded-2xl overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 shadow-2xl z-10 bg-cover bg-[url('./Assets/pictures/Tacos.jpg')]">
        
        <div class="py-2.5 px-2.5 text-left justify-between hover:bg-indigo-400 hover:bg-opacity-50 w-72 text-left shadow-lg shadow-white tacoCard">
          <div class="font-extrabold text-xl h-1/4 mb-2">${localStorageTest.data[i].restaurant_name} </div>
          <p class="text-black font-semibold text-left text-base"> Address: ${localStorageTest.data[i].address.formatted}</p><br>`;
          if (localStorageTest.data[i].restaurant_website != null) {
            tacoCardTemplate += websiteAdd(localStorageTest.data[i].restaurant_website);
          }
          tacoCardTemplate += `<br><button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded tacoMenuBtn" data-modal-toggle="menuModal">Taco Menu</button>
          <div class="invisible">${i}</div>
          </div>
      </div>`;
      tacoTable.innerHTML += tacoCardTemplate;
    }
    var menuButtonEl = document.getElementsByClassName(`tacoMenuBtn`);
    for (let i = 0; i < menuButtonEl.length; i++) {
      menuButtonEl[i].addEventListener(`click`, getTacoMenu);
    }
  }
}

function websiteAdd(data) {
  var removeURL = data.replace(/^https?:\/\//, "");
  // Figure out how to wrap website text when smaller screen size
  let websiteTemplate = `
  <a href=${data} target="_blank" class="object-cover text-black text-xs font-semibold no-underline hover:decoration-2 hover:underline">${removeURL}</a>`;
  return websiteTemplate;
}

function getTacoMenu() {
  // Add JS to pull taco items from object within menu, and display taco menu within #tacoMenuList
  // Search through Object credit: https://stackoverflow.com/questions/8517089/js-search-in-object-values
  var results = [];
  toggleModal(`menuModal`, true);
  tacoIndex = this.nextElementSibling.innerHTML;
  console.log(brewIndex, tacoIndex);
  // var object = localStorageTest.data[index].menus;
  // console.log(object);
  // console.log(object.menu_sections);
  // Searches for tacos in menu, pusshes to an array
  // for (let i = 0; i < object.length; i++) {
  //   for(key in object[i]){
  //    if(object[i][`key`].indexOf(`Taco`) != -1){
  //        results.push(object[i]);
  //    }
  //  }
  // }

  // Loop to add new <li> with each
}

saveBtn.addEventListener(`click`, savePairing)
// Make saveBtn save both brewery and taco location objects in to local storage

function savePairing(event) {  
  event.preventDefault;
  console.log(brewIndex, tacoIndex);
  favorites.brewery.push(breweryApiData[brewIndex]);
  favorites.tacos.push(tacoApiData[tacoIndex]);
  console.log(favorites);
  window.localStorage.setItem(`favorites`, JSON.stringify(favorites));

}
