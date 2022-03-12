var tableBody = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
// Documenu Geo API / Needs fresh key for demonstration
var documenuApi =
  "https://api.documenu.com/v2/restaurants/search/geo?key=1d72ed71331751f36558c92ff7f8a0cf&cuisine=Mexican&distance=2&fullmenu";
  // additional key: 442e928049c9bb7b553d48b27474017a - Miguel
  // KEY FOR DEMO: bb8246f243790c635ad142fe7f2030ba
var zipCodeVariable = "";
// Test Variables
var coordinate = [ ];
// Get hoppiness button event listener
buttonClick.addEventListener("click", geocode);

// Brewery card selected event listener

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var openBreweryDBUrl =
    "https://api.openbrewerydb.org/breweries?per_page=5&by_dist=";

  openBreweryDBUrl += `${coordinate[0]},${coordinate[1]}`;

  console.log(openBreweryDBUrl);

  fetch(openBreweryDBUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    // loop to add data to table

    // document.getElementById("breweryTable").empty();

    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        let template = `
 GJC_Dev
    <div class="rounded overflow-hidden shadow-lg">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${data[i].name}</div>
        <p class="text-gray-700 text-base">
          ${data[i].state}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-8">${data[i].brewery_type}</span>
      </div>
                        `;

      <tr>
                            <td class="w-1/2 py-2 border-2 border-teal-200 bg-slate-100">${data[i].name}</td>
                            <td class="w-1/4 py-2 border-2 border-teal-200 bg-slate-100">${data[i].brewery_type}</td>
                            <td class="w-1/4 py-2 border-2 border-teal-200 bg-slate-100">${data[i].state}</td>
                            <tr>
                            `;
 Development
        tableBody.innerHTML += template;
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
  var openWeatherApi = `http://api.openweathermap.org/geo/1.0/zip?appid=d20682e8d5e2100a9c4e1e2f42e32a85&zip=${zipCodeVariable},US`;
 fetch(openWeatherApi)
 .then(function(response)
 {
   return response.json();
 })

.then(function(data){
  console.log(data, data.lat, data.lon);
  coordinate=[data.lat, data.lon];
  console.log(coordinate);
  findHoppiness(coordinate);
  getTaco(coordinate);
})
};

// Function to pull Mexican food from geolocation
function getTaco(coordinate) {
  var documenuUrl = `${documenuApi}&lat=${coordinate[0]}&lon=${coordinate[1]}`;
  console.log(documenuUrl);

  fetch(documenuUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (tacoData) {
      console.log(tacoData);
      for (var i = 0; i < tacoData.data.length; i++) {
        let template = `
                        <tr>
                        <td class="w-1/2 py-2 border-2 border-teal-200 bg-slate-100">${tacoData.data[i].restaurant_name}</td>
                        <td class="w-1/4 py-2 border-2 border-teal-200 bg-slate-100">${tacoData.data[i].address.state}</td>
                        <tr>
                        `;
        tacoTable.innerHTML += template;
      }
    });
}