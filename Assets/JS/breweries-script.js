var tableBody = document.getElementById("breweryTable");
var tacoTable = document.getElementById("tacoTable");
var buttonClick = document.getElementById("submitButton");
// Documenu Geo API
var documenuApi =
  "https://api.documenu.com/v2/restaurants/search/geo?key=442e928049c9bb7b553d48b27474017a&cuisine=Mexican&distance=2&fullmenu&";
var zipCodeVariable = "";
// Test Variables
var lat = 41.92;
var lon = -87.76;

// Validated API connection to https://www.openbrewerydb.org/ using a static zipcode
function openBreweriesApi() {
  zipCodeVariable = document.getElementById("zipCode").value;
  console.log(zipCodeVariable);
  var openBreweryDBUrl = "https://api.openbrewerydb.org/breweries?by_postal=";

  var documenuUrl = documenuApi + "lat=" + lat + "&lon=" + lon;
  console.log(documenuUrl);

  openBreweryDBUrl += zipCodeVariable;

  console.log(openBreweryDBUrl);

  fetch(openBreweryDBUrl)
    .then(function (response) {
      return response.json();
    })
    // loop to add data to table

    // document.getElementById("breweryTable").empty();

    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        let template = `
    <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 w-1/4 content-between hover:scale-105">
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

buttonClick.addEventListener("click", openBreweriesApi);

// Starting on submit function when the enter key is hit while in the Zip Code area
// zipCode.addEventListener("keyup", (event) => {
//   if(event.keyCode === 13); {
//     event.preventDefault();
//     console.log("enter hit")
//   }
// });
