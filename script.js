const apiKey = "4f7869ce3d5722411e808b80d43f12ba"
let locationSafe = [];




function getCurrent (city) {
    var queryURL ="http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey
    $.ajax({
        url : queryURL,
        method : "GET"
    
    }).then(function (response) {
        console.log(response)
       // create card for current weather
        let todayCard = $("<div>").attr("class", "card-bg-light");
        $("#cityForecast").append(todayCard);
        // add header
        let todayCardHead = $("<div>").attr("class", "card-header").text("Current Weather in " + response.name);
        todayCard.append(todayCardHead);

        let cardRow = $("<div>").attr("class", "row no-gutters");
        todayCard.append(cardRow);

        let picURL = "http://openweather.org/img/wn/" + response.weather[0].icon + "@2x.png";

        let todayPic = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src",picURL).attr("class","card-img"));
        cardRow.append(todayPic);

    })
}


$("#searchBtn").on("click", function () {
    let cityName = $("#searchInput").val().trim();
    getCurrent(cityName);
})