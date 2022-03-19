var savedFavorites = JSON.parse(localStorage.favorites)
var favoriteTacos = savedFavorites.tacos;
var favoriteBreweries = savedFavorites.brewery;
var favoritesTable = document.getElementById("favoritesTable");

function websiteAdd(data) {
		var removeURL = data.replace(/^https?:\/\//, "");
		// Figure out how to wrap website text when smaller screen size
		let websiteTemplate = `
		<a href=${data} target="_blank" class="object-cover text-Indigo-900  text-xs lg:text-lg font-semibold no-underline hover:decoration-2 hover:underline">${removeURL}</a>`;
		return websiteTemplate;
}

function populateFavorites () {
		favoritesTable.innerHTML = "";
				for (var i = 0; i < favoriteTacos.length; i++) {


						// Brewery Cards
						let template = `
						<tr class="bg-white bg-opacity-75">

							<td class="lg:py-4 lg:px-6 py-1 px-1 text-sm border-2 flex-initial font-medium text-gray-900 whitespace-nowrap">  
												
								<div class="rounded-2xl overflow-hidden shadow-lg p-1 h-max lg:p-2.5 text-left justify-between text-left hover:scale-105 z-10 bg-cover bg-[url('./Assets/pictures/BeerSuds.jpg')]">
	
									<div class="font-bold flex-wrap lg:flex-none lg:font-extrabold text-sm lg:text-lg lg:h-1/4 mb-2">${favoriteBreweries[i].name}</div>

									<p class="text-black flex-initial font-semibold text-left text-xs lg:text-lg"> Address: <br>
									${favoriteBreweries[i].street} <br>
									${favoriteBreweries[i].city}, ${favoriteBreweries[i].state}
									${favoriteBreweries[i].postal_code.substring(0,5)}</p><br>`;
										if (favoriteBreweries[i].website_url != null) {
											template += websiteAdd(favoriteBreweries[i].website_url);
										} else {
											template += `<br>`
										}

						// Taco Cards
						template +=  `
								</div>                          
							</td>                          

							<td class="lg:py-4 lg:px-6 py-1 px-1 text-sm border-2 flex-initial font-medium text-gray-900 whitespace-nowrap">
																																		
								<div class="rounded-2xl overflow-hidden shadow-lg p-1 h-max lg:p-2.5 text-left justify-between text-left hover:scale-105 z-10 bg-cover bg-[url('./Assets/pictures/Tacos.jpg')]">

									<div class="font-bold flex-wrap lg:flex-none lg:font-extrabold text-sm lg:text-lg lg:h-1/4 mb-2">${favoriteTacos[i].restaurant_name}</div>
							
									<p class="text-black flex-initial font-semibold text-left text-xs lg:text-lg"> 
										Address: <br>
										${favoriteTacos[i].address.street} <br>
										${favoriteTacos[i].address.city}, ${favoriteTacos[i].address.state}
										${favoriteTacos[i].address.postal_code}
									</p><br>`;
											
										if (favoriteTacos[i].restaurant_website != "") {
										template += websiteAdd(favoriteTacos[i].restaurant_website);
										} else {
												template += `<br>`
										}							
					
						template += `
								</div>
							</td>
							<td class="py-4 px-6 text-sm font-medium border-2 text-right whitespace-nowrap">
									<input type="button"
											class="text-blue-600 hover:underline deleteButton" value="Delete" name=${i} onclick="deleteButton()">						
							</td>
						</tr>`
																												
								
								
								favoritesTable.innerHTML += template;
									}
						
								}
populateFavorites();

var rowIndex = "";


function deleteButton() {
		rowIndex = event.target.name;

		var savedBrewery = savedFavorites.brewery
		var savedTacos = savedFavorites.tacos
		
		savedBrewery.splice(rowIndex,1)
		savedTacos.splice(rowIndex,1)
		console.log(savedBrewery);
		console.log(savedTacos);

var localStoragePush = {
				brewery: savedBrewery, 
				tacos: savedTacos,
		};

		console.log(localStoragePush);

		window.localStorage.setItem(`favorites`, JSON.stringify(localStoragePush));

		populateFavorites();

}
