var breweriesRight = document.querySelector("#brewButtonRight");
var breweriesLeft = document.querySelector("#brewButtonLeft");
var tacosRight = document.querySelector("#tacoButtonRight");
var tacosLeft = document.querySelector("#tacoButtonLeft");
      
breweriesRight.addEventListener("click", function(event){
document.querySelector("#breweryTable").scrollLeft += 640;
})

breweriesLeft.addEventListener("click", function(event){
document.querySelector("#breweryTable").scrollLeft -= 640;
})

tacosRight.addEventListener("click", function(event){
document.querySelector("#tacoTable").scrollLeft += 640;
})

tacosLeft.addEventListener("click", function(event){
document.querySelector("#tacoTable").scrollLeft -= 640;
})