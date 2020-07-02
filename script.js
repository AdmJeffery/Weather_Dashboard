const apiKey = "4f7869ce3d5722411e808b80d43f12ba"
let locationSafe = [];




function getCurrent (city) {
    var queryURL ="http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey
    $.ajax({
        url : queryURL,
        method : "GET"
    
    }).then(function (response) {
        console.log(response)
    })
}


$("#searchBtn").on("click", function () {
    let cityName = $("#searchInput").val().trim();
    getCurrent(cityName);
})