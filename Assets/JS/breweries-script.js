var breweryTable = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
// Documenu Geo API / Needs fresh key for demonstration

// Used Miguel's key for testing brewery layout to reduce unnecessary pulls
var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=442e928049c9bb7b553d48b27474017a&cuisine=Mexican&distance=2&fullmenu";
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=1d72ed71331751f36558c92ff7f8a0cf&cuisine=Mexican&distance=2&fullmenu";
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=e59184fab7b4752cf7593f7ca4a627f1&cuisine=Mexican&distance=2&fullmenu";
// additional key: 442e928049c9bb7b553d48b27474017a - Miguel
// KEY FOR DEMO: bb8246f243790c635ad142fe7f2030ba
var zipCodeVariable = "";
var coordinate = [];
// Get hoppiness button event listener
buttonClick.addEventListener("click", geocode);

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var openBreweryDBUrl = "https://api.openbrewerydb.org/breweries?per_page=10&by_dist=";

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
      <div class="py-2.5 px-2.5 brewCard">
      <div class="font-bold text-xl mb-2">${data[i].name}</div>
      <p class="text-gray-700 text-base"> Address: 
      ${data[i].street} <br>
      <span class="pl-16">${data[i].city},
      ${data[i].state}</span><br>
      <span class="pl-16"> ${data[i].postal_code}</span>
          </p>
          <br>`
        if (data[i].website_url != null) {
          template += websiteAdd(data[i].website_url);
        }

        template += `<br>
        <div class="invisible" id="brewLat">${data[i].latitude}</div>
        <div class="invisible" id="brewLon">${data[i].longitude}</div>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-8 border-2 border-black">${data[i].brewery_type}</span>
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
  zipCodeVariable = document.getElementById("zipCode").value;
  var openWeatherApi = `https://api.openweathermap.org/geo/1.0/zip?appid=d20682e8d5e2100a9c4e1e2f42e32a85&zip=${zipCodeVariable},US`;

  fetch(openWeatherApi)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        response.json()
          .then(function (data) {
            coordinate = [data.lat, data.lon];
            findHoppiness(coordinate);
          });
      } else {
        console.log(`error ${response.status}`);
      }
    })
};

// Function to pull Mexican food from geolocation of brewery card selection
function getTaco() {
  tacoTable.innerHTML = "";
  // console.log(`We clicked on a card`);
  // console.log(this.querySelector(`#brewLat`).innerHTML)
  var documenuUrl = `${documenuApi}&lat=${this.querySelector(`#brewLat`).innerHTML}&lon=${this.querySelector(`#brewLon`).innerHTML}`;
  console.log(documenuUrl);

  fetch(documenuUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (tacoData) {
      console.log(tacoData);
      for (var i = 0; i < tacoData.data.length; i++) {
        let template = `
        <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400">
      <div class="py-2.5 px-2.5 bg-[url('./Assets/pictures/Tacos.jpg')] tacoCard">
      <div class="font-bold text-xl mb-2">${tacoData.data[i].restaurant_name}</div>
      <p class="text-gray-700 text-base"> Address: 
      ${tacoData.data[i].address.formatted}
          </p>
          <br>`
        if (tacoData.data[i].restaurant_website != null) {
          template += websiteAdd(tacoData.data[i].restaurant_website);
        }
        template += `<br><button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded data-modal-toggle="popup-modal">
          Taco Menu
         </button>
         </div>
         </div>            `;
        tacoTable.innerHTML += template;
        var tacoCardEl = document.getElementsByClassName(`tacoCard`);
        for (let i = 0; i < tacoCardEl.length; i++) {
          tacoCardEl[i].addEventListener(`click`, tacoModal);
        }
      }
    });
}
// Add menu functionality to getTaco menu button
//  <button class="btn btn-red bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-8">
//   ${tacoData.data[i].menus} 
//   </button>

function websiteAdd(data) {
  // Figure out how to wrap website text when smaller screen size
  let websiteTemplate = `
  <a href=${data} target="_blank" class="blue-300 underline hover:decoration-2">${data}</a>`
  return websiteTemplate;
}


function tacoModal(event) {
  event.preventDefault();
  let modalEl = `
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div
      class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start"></div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Taco Menu</h3>
          <div class="mt-2" id="menu">
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Add
          to Favorites</button>
        <button type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Return</button>
      </div>
    </div>
  </div>
</div>`
  document.getElementById(`tacoModal`) += modalEl;
}

