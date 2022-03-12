var breweryCardArray = {};
var breweryCard;
var tableBody = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
// Documenu Geo API / Needs fresh key for demonstration

// Used Miguel's key for testing brewery layout to reduce unnecessary pulls
var documenuApi = "https://api.documenu.com/v2/restaurants/search/geo?key=442e928049c9bb7b553d48b27474017a&cuisine=Mexican&distance=2&fullmenu";
// "https://api.documenu.com/v2/restaurants/search/geo?key=1d72ed71331751f36558c92ff7f8a0cf&cuisine=Mexican&distance=2&fullmenu";
// additional key: 442e928049c9bb7b553d48b27474017a - Miguel
// KEY FOR DEMO: bb8246f243790c635ad142fe7f2030ba
var zipCodeVariable = "";
// Test Variables
var coordinate = [];
// Get hoppiness button event listener
buttonClick.addEventListener("click", geocode);

// Brewery card selected event listener

// Function to pull brewery information based on geolocation
function findHoppiness(coordinate) {
  var openBreweryDBUrl = "https://api.openbrewerydb.org/breweries?per_page=10&by_dist=";
  
  openBreweryDBUrl += `${coordinate[0]},${coordinate[1]}`;
  
  console.log(openBreweryDBUrl);
  
  // Clear cards when completing an additional search
  tableBody.innerHTML = "";
  fetch(openBreweryDBUrl) 
  
  .then(function (response) {
    return response.json();
  })
  // loop to add data to table
  
  
  .then(function (data) {
    console.log(data);
    // console.log(data);
    for (var i = 0; i < data.length; i++) {
      breweryCard = {
        Name: data[i].name,
        Street: data[i].street,
        City: data[i].city,
        State: data[i].state,
        PostalCode: data[i].postal_code,
        WebsiteURL: data[i].website_url,
        Lat: data[i].latitude,
        Lon: data[i].longitude,
      }
      
      console.log(breweryCard);

      // beginning to adding to the DOM via create element. If a URL returns as null via the API we can not post a link.
      // const breweryCardNode1 = document.createElement('div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 w-1/4 content-between hover:scale-105"');
      // breweryCardNode1.setAttribute()
      // const breweryCardNode2 = document.createElement('div class="py-2.5 px-2.5"');
      // const breweryCardNode3 = document.createElement('div class="font-bold text-xl mb-2" id="breweryName');
      
      
      
      let template = `<div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 w-1/4 content-between hover:scale-105 bg-purple-200 hover: bg-purple-300">
      <div class="py-2.5 px-2.5">
      <div class="font-bold text-xl mb-2">${data[i].name}</div>
      <p class="text-gray-700 text-base"> Address: 
      ${data[i].street} <br>
      <span class="pl-16">${data[i].city},
      ${data[i].state}</span><br>
          <span class="pl-16"> ${data[i].postal_code}</span>
          </p>
          <br>
          <a href=${data[i].website_url} target="_blank" class="blue-300 underline hover:decoration-2">Website</a><br><br>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-8 border-2 border-black">${data[i].brewery_type}</span>
          </div>
          </div>            `;
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
              .then(function (response) {
                return response.json();
              })
              
              .then(function (data) {
                // console.log(data, data.lat, data.lon);
                coordinate = [data.lat, data.lon];
                // console.log(coordinate);
                findHoppiness(coordinate);
                getTaco(coordinate);
              })
            };
            
            // Function to pull Mexican food from geolocation
            function getTaco(coordinate) {
              var documenuUrl = `${documenuApi}&lat=${coordinate[0]}&lon=${coordinate[1]}`;
              // console.log(documenuUrl);
              
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