const apiKey = "4d386df1a445943047c0faf9efafd3c0"

var queryURL ="api.openweathermap.org/data/2.5/weather?q=" + "provo" + "&appid=" + apiKey
$.ajax({
    url = queryURL,
    method = "GET",

}).then(function (response) {
    console.log(response)
}