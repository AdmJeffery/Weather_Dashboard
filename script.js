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

        let picURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

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
            console.log(temp)

        let tempFah = Math.floor((temp-273.15) * 9/5 + 32);
            console.log(tempFah);

        infoBody.append($("<p>").attr("class", "card-text").html("Temperature: " +tempFah))

        infoBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity))

        infoBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " +response.wind.speed))

        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
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
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=" + apiKey;

    $.ajax({
        url : queryURL,
        method : "GET"
    }).then(function(response){
        console.log (response);
        //make new row for 5 day forecast cards.
        let fiveDayRow = $("<div>").attr("class", "fiveDayForecast");
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


            }
        }
    })
}


$("#searchBtn").on("click", function () {
    let cityName = $("#searchInput").val().trim();

    getCurrent(cityName);
    
})