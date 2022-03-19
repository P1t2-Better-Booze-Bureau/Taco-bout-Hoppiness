// Array of Documenu APi keys, one pulled at random on page load.
var documentApiKeys = ["f2891f69c0b5f586001e03d7f04150cd", "5c84bf0ba620e31313ba63c7c9b54297","1d72ed71331751f36558c92ff7f8a0cf", "e59184fab7b4752cf7593f7ca4a627f1", "442e928049c9bb7b553d48b27474017a", "bb8246f243790c635ad142fe7f2030ba", "aeb59f84ae3c5fc239e52dd74a168c50"];
var selectedKey = documentApiKeys[Math.floor(Math.random()*documentApiKeys.length)];
var documenuApi =`https://api.documenu.com/v2/restaurants/search/geo?key=${selectedKey}&cuisine=Mexican&distance=2&fullmenu`;

var breweryTable = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
var menuModal = document.getElementById(`menuModal`);
var saveBtn = document.getElementById(`saveBtn`);
var cancelBtnEl = document.querySelector(`#cancelBtn`);
var zipCodeInput = document.getElementById("zipCode");
var menu = document.getElementById(`tacoMenuList`);
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

// Starts function on enter key being hit in the input section
zipCodeInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    console.log("enter");
    geocode();
  }
});

// Start on button click
buttonClick.addEventListener("click", geocode);

// Save brewery/taco pairing from modal
saveBtn.addEventListener(`click`, savePairing)

// Function to pull geolocation from user zip code
function geocode() {
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
      // Add 404 Page eventually
    }
  });
}

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var tumbleweed = document.getElementById("tumbleweed");
  tumbleweed.classList.add("hidden");
  // Displays scroll for breweries
  var leftBrewHidden = document.getElementById("brewButtonLeft");
  var rightBrewHidden = document.getElementById("brewButtonRight");
  var brewBannerSubmit = document.getElementById("brewBanner");
  var pickBannerSubmit = document.getElementById("pickYourBrewBanner");
  leftBrewHidden.classList.add("sm:block");
  rightBrewHidden.classList.add("sm:block");
  brewBannerSubmit.classList.add("hidden");
  pickBannerSubmit.classList.remove("hidden");
  var openBreweryDBUrl ="https://api.openbrewerydb.org/breweries?per_page=10&by_dist=";
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
        <div class="rounded-2xl overflow-hidden shadow-2xl flex flex-shrink-0 min-w-1/4 content-between font-mono hover:scale-105 shadow-2xl z-10 bg-coverfont-extrabold bg-[url('./Assets/pictures/BeerSuds.jpg')]">

          <div class="py-2.5 px-2.5 text-left justify-between hover:bg-indigo-400 hover:bg-opacity-50 w-72 text-left brewCard">

            <div class="font-extrabold text-xl h-1/4 mb-2 font-['Bungee_Inline']">${data[i].name}</div>
            <p class="text-black font-black text-left text-base"> Address: <br>
            ${data[i].street} <br>
            ${data[i].city}, ${data[i].state}<br>
            ${data[i].postal_code.substring(0,5)}</p><br>`;
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
  // Clear table every time
  tacoTable.innerHTML = "";
  // Adds lat and lon to documenuApi based on card selected.
  var documenuUrl = `${documenuApi}&lat=${this.querySelector(`#brewLat`).innerHTML}&lon=${this.querySelector(`#brewLon`).innerHTML}`;
  // Saves index of brewery card selected
  brewIndex = this.querySelector(`#brewIndex`).innerHTML;
  
  fetch(documenuApi).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (tacoData) {
        var leftTacoHidden = document.getElementById("tacoButtonLeft");
        var rightTacoHidden = document.getElementById("tacoButtonRight");
        var tacoBannerSubmit = document.getElementById("tacoBanner");
        leftTacoHidden.classList.add("sm:block");
        rightTacoHidden.classList.add("sm:block");
        tacoBannerSubmit.classList.remove("hidden");
        // Saves API pull into global scope variable
        tacoApiData = tacoData.data;
        // For testing purposes variable
        localStorageTest = tacoData;
        window.localStorage.setItem(`tacoTest`, JSON.stringify(localStorageTest));
        for (var i = 0; i < tacoApiData.length; i++) {
          let tacoCardTemplate = `
          <div class="rounded-2xl overflow-hidden shadow-2xl flex flex-shrink-0 min-w-1/4 content-between font-mono hover:scale-105 shadow-2xl bg-cover bg-[url('./Assets/pictures/Tacos.jpg')]">
            <div class="py-2.5 px-2.5 tacoCard">

              <div class="font-extrabold text-xl mb-2 font-['Bungee_Inline']">${tacoApiData[i].restaurant_name}</div>

              <p class="bg-amber-700 text-slate-100 text-base font-black font-mono"> Address: 
              ${tacoApiData[i].address.formatted}</p><br>`;

          if (tacoApiData[i].restaurant_website != null) {
            tacoCardTemplate += websiteAdd(tacoApiData.data[i].restaurant_website);
          }

          tacoCardTemplate += `<br>
              <button class="bg-red-500 hover:bg-red-700 text-black font-extrabold font-mono py-2 px-4 rounded tacoMenu">
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
      })
    } else {
      // Pull from test object for if Documenu key is depleted or API is down
      tacoApiData = localStorageTest.data;
      for (var i = 0; i < tacoApiData.length; i++) {
        // Scroll Feature
        var leftTacoHidden = document.getElementById("tacoButtonLeft");
        var rightTacoHidden = document.getElementById("tacoButtonRight");
        var tacoBannerSubmit = document.getElementById("tacoBanner");
        leftTacoHidden.classList.add("sm:block");
        rightTacoHidden.classList.add("sm:block");
        tacoBannerSubmit.classList.remove("hidden");
        // Saves API pull into global scope variable
        let tacoCardTemplate = `
        <div class="rounded-2xl overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 font-mono shadow-2xl z-10 bg-cover bg-[url('./Assets/pictures/Tacos.jpg')]">
          
          <div class="py-2.5 px-2.5 text-left font-extrabold justify-between hover:bg-indigo-400 hover:bg-opacity-50 w-72 text-left shadow-lg shadow-white tacoCard">
            <div class="font-extrabold text-xl h-1/4 mb-2 font-['Bungee_Inline']">${tacoApiData[i].restaurant_name} </div>
            <p class="text-black font-black text-left text-base"> Address: ${tacoApiData[i].address.formatted}</p><br>`;
            if (tacoApiData[i].restaurant_website != null) {
              tacoCardTemplate += websiteAdd(tacoApiData[i].restaurant_website);
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
  });
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
  menu.innerHTML = "";
  // var results = [];
  toggleModal(`menuModal`, true);
  tacoIndex = this.nextElementSibling.innerHTML;
  var object = tacoApiData[tacoIndex].menus;
  // console.log(object);
  // console.log(object[0].menu_sections[4]);
  // console.log(object.menu_sections);
  // Searches for tacos in menu, pusshes to an array
  // for (let i = 0; i < object.length; i++) {
  //   for(key in object[i]){
  //    if(object[i][`key`].indexOf(`Taco`) != -1){
  //        results.push(object[i]);
  //    }
  //  }
  // }

  // Use moms old recipe for test
  var tacoMenu = object[0].menu_sections[4].menu_items;
  // Loop to add new <li> with each taco menu item
  for (let i = 0; i < tacoMenu.length; i++) {
    var tacoEl = document.createElement("li");
    var menuItem = document.createTextNode(`${tacoMenu[i].name}     $${tacoMenu[i].price}`);
    tacoEl.appendChild(menuItem);
    console.log(tacoEl);
    menu.appendChild(tacoEl);
  }
}

// Make saveBtn save both user selected brewery and taco objects in to local storage
function savePairing(event) {  
  event.preventDefault;
  favorites.brewery.push(breweryApiData[brewIndex]);
  favorites.tacos.push(tacoApiData[tacoIndex]);
  window.localStorage.setItem(`favorites`, JSON.stringify(favorites));
  toggleModal(`menuModal`, false);
}
