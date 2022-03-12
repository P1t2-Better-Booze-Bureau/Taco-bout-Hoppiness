var breweryTable = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
// Documenu Geo API / Needs fresh key for demonstration

// Used Miguel's key for testing brewery layout to reduce unnecessary pulls
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=442e928049c9bb7b553d48b27474017a&cuisine=Mexican&distance=2&fullmenu";
// var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=1d72ed71331751f36558c92ff7f8a0cf&cuisine=Mexican&distance=2&fullmenu";
var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=e59184fab7b4752cf7593f7ca4a627f1&cuisine=Mexican&distance=2&fullmenu";
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

        let template = `<div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400  bg-[url('./Assets/pictures/BeerSuds.jpg')]">
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

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 8,
//     center: { lat: -95.7129, lng: 37.0902 },
//     mapTypeControl: false,
//   });
// }

// Function to pull geolocation from user zip code
function geocode() {
  zipCodeVariable = document.getElementById("zipCode").value;
  var openWeatherApi = `https://api.openweathermap.org/geo/1.0/zip?appid=d20682e8d5e2100a9c4e1e2f42e32a85&zip=${zipCodeVariable},US`;
  fetch(openWeatherApi)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      coordinate = [data.lat, data.lon];
      findHoppiness(coordinate);
    })
};

// Function to pull Mexican food from geolocation of brewery card selection
function getTaco() {
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
        let template = `<div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400">
      <div class="py-2.5 px-2.5 bg-[url('./Assets/pictures/Tacos.jpg')] tacoCard">
      <div class="font-bold text-xl mb-2">${tacoData.data[i].restaurant_name}</div>
      <p class="text-gray-700 text-base"> Address: 
      ${tacoData.data[i].address.formatted}
          </p>
          <br>`
        if (tacoData.data[i].restaurant_website != null) {
          template += websiteAdd(tacoData.data[i].restaurant_website);
        }
          template += `<button class="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded">
          Menu
         </button>
         </div>
         </div>            `;
        tacoTable.innerHTML += template;
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
