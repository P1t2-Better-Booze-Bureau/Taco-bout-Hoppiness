// var tacoData = localStorage.getItem("mytime");

console.log(localStorage)
console.log(localStorage.tacoTest)

var tacoData = localStorage.getItem("tacoTest");
var tacoData2 = JSON.parse(tacoData)

console.log(tacoData);
console.log(tacoData2);
// function Parse(tacoData) {
//     return tacoData.json();}
    
// console.log(data);


// var taco = JSON.parse(localStorageTest.tacoTest)
// console.log(taco)

function populateFavorites (tacoData2) {
    for (var i = 0; i < data.length; i++) {
      let template = `
      <div class="rounded overflow-hidden shadow-lg flex flex-shrink-0 min-w-1/4 content-between hover:scale-105 bg-indigo-300 hover:bg-indigo-400 bungee font-bold bg-[url('./Assets/pictures/Tacos.jpg')]">
    
        <div class="py-2.5 px-2.5 text-left justify-between hover:bg-indigo-400 hover:bg-opacity-50 tacoCard">
         <div class="font-bold text-xl mb-2">${localStorageTest.data[i].restaurant_name} </div>
         <p class="text-black font-semibold text-left text-base class="bg-amber-700 text-slate-100 text-base"> Address: ${localStorageTest.data[i].address.formatted}</p><br>`;
         
         if (localStorageTest.data[i].restaurant_website != null) {
        tacoCardTemplate += websiteAdd(
          localStorageTest.data[i].restaurant_website
        );
         }
        

      tacoTable.innerHTML += tacoCardTemplate;