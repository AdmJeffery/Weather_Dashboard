const apiKey = "4f7869ce3d5722411e808b80d43f12ba"
let locationSafe = [];

let currentLocation;

$(document).ready(function(){

    // upon page load, grab searches from local storage and display the last city searched.
    locationSafe = JSON.parse(localStorage.getItem("citysearches"));

    if (locationSafe) {
        currentLocation = locationSafe[locationSafe.length - 1];
        showPreviousSearches();
        getCurrent(currentLocation);
    }
})

function getCurrent (city) {
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey
    $.ajax({
        url : queryURL,
        method : "GET"
    
    }).then(function (response) {
        
       // create card for current weather
        let todayCard = $("<div>").attr("class", "card-bg-light");
        $("#cityForecast").append(todayCard);
        // add header
        let todayCardHead = $("<div>").attr("class", "card-header").text("Current Weather in " + response.name);
        todayCard.append(todayCardHead);

        let cardRow = $("<div>").attr("class", "row no-gutters");
        todayCard.append(cardRow);

        let picURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        let todayPic = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src",picURL).attr("class","card-img"));
        cardRow.append(todayPic);

        //Begin making current weather card
        let textDiv = $("<div>").attr("class","col-md-8");
        let infoBody = $("<div>").attr("class", "card-body")
            textDiv.append(infoBody);
            cardRow.append(textDiv);

            infoBody.append($("<h3>").attr("class", "card-title").text(response.name))

        let dateToday= moment(response.dt, "X").format("MMMM Do YYYY h:mm a");
            infoBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text(dateToday)))

        let temp = Number(response.main.temp)
            

        let tempFah = Math.floor((temp-273.15) * 9/5 + 32);
            

        infoBody.append($("<p>").attr("class", "card-text").html("Temperature: " +tempFah + " F"))

        infoBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"))

        infoBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " +response.wind.speed + "MPH"))

        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=inperial";
        $.ajax({
            url: uvURL,
            method : "GET"
            }).then(function (uvresponse){
                let uvInfo = uvresponse.value;
                let bgcolor;

                if (uvInfo < 3){
                    bgcolor = "green";
                }
                else if (uvInfo >= 3 && uvInfo <= 6){
                    bgcolor = "yellow";
                }
                else if (uvInfo >= 6 && uvInfo <= 8){
                    bgcolor = "orange";
                }
                else {
                    bgcolor = "red"
                }

                let uvDisp = $("<p>").attr("class", "card-text").text("UV Index:");
                uvDisp.append($("<span>").attr("class","uvIndex").attr("style","background-color:" + bgcolor).text(uvInfo))
                infoBody.append(uvDisp);
            })
            cardRow.append(textDiv);
            getForecast(response.id);
    })
}

function getForecast(city){
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url : queryURL,
        method : "GET"
    }).then(function(response){
        
        //make new row for 5 day forecast cards.
        let fiveDayRow = $("<div>").attr("class", "forecast");
        $("#cityForecast").append(fiveDayRow);

        for (i=0; i<response.list.length; i++) {
            if (response.list[i].dt_txt.indexOf("12:00:00") !== -1){

                let column = $("<div>").attr("class", "one-fifth");
                fiveDayRow.append(column);

                let dayCard = $("<div>").attr("class", "card text-white bg-primary");
                column.append(dayCard);

                let header = $("<div>").attr("class", "card-header").text(moment(response.list[i].dt, "X").format("MMM Do"));
                dayCard.append(header);

                let icon = $("<img>").attr("class", "card-img-top").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png" );
                dayCard.append(icon);

                let body = $("<div>").attr("class", "card-body");
                dayCard.append(body);

                let temp = $("<p>").attr("class", "fiveDayTemp").text("Temp: " + response.list[i].main.temp + " F");
                body.append(temp);

                let humid = $("<p>").attr("class", "fiveDayHumid").text("Humidity: " + response.list[i].main.humidity + "%")
                body.append(humid);
            }
        }
    })
}


$("#searchBtn").on("click", function () {

    event.preventDefault();

    let cityName = $("#searchInput").val().trim();

    if (cityName !== "") {
        clearData();
        currentLocation = cityName;
        
        saveSearch(cityName);

        $("#searchInput").val("");

        getCurrent(cityName);
    

    }
})

function clearData () {
    // function meant to clear displayed weather data
    $("#cityForecast").empty();
};

function saveSearch(city) {
    //adds to locationSafe array and initializes local storage
    if (locationSafe === null) {
        locationSafe = [city];
    }
    else if (locationSafe.indexOf(city)===-1){
        locationSafe.push(city);
    }

    localStorage.setItem("citysearches", JSON.stringify(locationSafe));
    showPreviousSearches();
}

function showPreviousSearches() {
    if (locationSafe){
        $("#previousSearches").empty();
        let buttons = $("<div>").attr("class", "list-group");
        for ( let i = 0; i < locationSafe.length; i++){
            let cityButton = $("<a>").attr("href", "#").attr("id", "cityButton").text(locationSafe[i]);

            if (locationSafe[i] == currentLocation){
                cityButton.attr("class","list-group-item list-group-item-action active")
            }
            else {
                cityButton.attr("class", "list-group-item list-group-item-action");
            }
            buttons.prepend(cityButton);
        }
        
        $("#previousSearches").append(buttons);
    }
}

$(document).on("click","#cityButton", function(){
    clearData ();
    currentLocation= $(this).text();
    showPreviousSearches();
    getCurrent(currentLocation);

})
