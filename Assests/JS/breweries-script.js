var tableBody = document.getElementById("breweryTable");
var buttonClick = document.getElementById("submitButton");
var zipCodeVariable = "";

// Validated API connection to https://www.openbrewerydb.org/ using a static zipcode
function openBreweriesApi() {
  zipCodeVariable = document.getElementById("zipCode").value;
  console.log(zipCodeVariable);
  var openBreweryDBUrl = "https://api.openbrewerydb.org/breweries?by_postal=";

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
                        <tr>
                            <td class="w-1/2 py-2 border-2 border-teal-200 bg-slate-100">${data[i].name}</td>
                            <td class="w-1/4 py-2 border-2 border-teal-200 bg-slate-100">${data[i].brewery_type}</td>
                            <td class="w-1/4 py-2 border-2 border-teal-200 bg-slate-100">${data[i].state}</td>
                        <tr>
                        `;
        tableBody.innerHTML += template;
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
