var breweriesRight = document.querySelector("#brewButtonRight");
var breweriesLeft = document.querySelector("#brewButtonLeft");
var tacosRight = document.querySelector("#tacoButtonRight");
var tacosLeft = document.querySelector("#tacoButtonLeft");
      
breweriesRight.addEventListener("click", function(event){
document.querySelector("#breweryTable").scrollLeft += 924;
})

breweriesLeft.addEventListener("click", function(event){
document.querySelector("#breweryTable").scrollLeft -= 924;
})

tacosRight.addEventListener("click", function(event){
document.querySelector("#tacoTable").scrollLeft += 924;
})

tacosLeft.addEventListener("click", function(event){
document.querySelector("#tacoTable").scrollLeft -= 924;
})