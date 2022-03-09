var tableBody = document.getElementById('breweryTable');

// Validated API connection to https://www.openbrewerydb.org/ using a static zipcode
function openBreweriesApi() {
  var openBreweryDBUrl =
    "https://api.openbrewerydb.org/breweries?by_postal=53212";

  fetch(openBreweryDBUrl)
    .then(function (response) {
      return response.json();
    })
    // loop to add data to table
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        let template = `
                        <tr>
                            <td>${data[i].name}</td>
                            <td>${data[i].brewery_type}</td>
                            <td>${data[i].state}</td>
                        <tr>
                        `
        tableBody.innerHTML += template;
      }
    });
}

openBreweriesApi();
