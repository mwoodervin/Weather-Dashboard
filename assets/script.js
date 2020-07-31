$(document).ready(function () {

let today = moment();
console.log(today);

$("#current-day").text(today.format("dddd | LL | h mm a"));

// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
// https://openweathermap.org/forecast5#name5

let apiKey = "e963e46c2f8cf92d1cc960a998d01e5d";


let searchButton = $("#search-button");

// CLICK EVENT
$(searchButton).on("click", function(event) {
    event.preventDefault();

getWeatherData();

});

// Function to query the Weather API
function getWeatherData() {

    // get zip code 
    let zipCode = $("#input-string").val().trim();
    console.log(zipCode);

    let queryURL = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + "&appid=" + apiKey;
$.ajax ({
    url: queryURL,
    method: "GET"
})
.then(function(response) {

    console.log(response);
    
    let lon = (response.coord.lon);
    let lat = (response.coord.lat);

    console.log(response.weather[0].icon);
    // to get the weather icon
    // http://openweathermap.org/img/wn/10d@2x.png

    console.log(((response.main.temp)* 9/5 - 459.67).toFixed(0));
    let queryForecastURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey;
    
    $.ajax ({
        url: queryForecastURL,
        method: "GET"  
    })
    .then(function(forecast) {

        console.log(forecast);
        let cityNameEl = $('<h2 id="city-name">'+ response.name +'</h2>');
        // let weatherIcon = $('<i id="weather-icon"></i>');
        let degreesFEl = $('<p id="degrees-f">Temperature: '+ (forecast.current.temp * 9/5 -459.67.toFixed(0)) +'</p>');
        let humidityEl = $('<p id="humidity">Humidity: '+ forecast.current.humidity + '% </p>');
        let windSpeedEl = $('<p id="wind-speed">Wind Speed: '+forecast.current.wind_speed +' </p>');
        let uvIndexEl = $('<p id="uv-index">UV Index: '+ forecast.current.uvi +'</p>');
        console.log($("#weather-intro"));
        $("#weather-intro").append(cityNameEl, degreesFEl, humidityEl, windSpeedEl, uvIndexEl);

        let uvIndex = forecast.current.uvi;

        if(uvIndex <= 2) {
            uvIndexEl.css("background-color", "green")
        }
        else if(uvIndex > 2 && uvIndex <= 5) {
            uvIndexEl.css("background-color", "yellow")
        }
        else if(uvIndex > 5 && uvIndex <= 7) {
            uvIndexEl.css("background-color", "orange")
        }
        else if(uvIndex > 7 && uvIndex <= 10) {
            uvIndexEl.css("background-color", "red")
        }
        else if(uvIndex > 10) {
            uvIndexEl.css("background-color", "purple")
        }

// append dummy column

// loop through forecast appending columns
{/* <div class="col-md-2"> = variable
<div class="card"></div> = variable
<!-- <img class="card-img-top" alt="Card image cap"> -->
<div class="card-body"> = variable
    <p>Date</p> = variable
    <p><i class="conditions"></i>weather logo</p>
    <p class="card-text">Temp: </p>
    <p class="card-text">Humidity</p>
    then start appending the <p> to the card-body
    then append card-body to card
    then append card to col-md-2
    then append col-md-2 to forecast-row
</div>
</div> */}


// append dummy column
    });
    

// dynamically add html elements to the page

})
}


});






// FROM CLASSWORK #5

// $(".city").html("<h1>" + response.name + " Weather Details</h1>");
// $(".wind").text("Wind Speed: " + response.wind.speed);
// $(".humidity").text("Humidity: " + response.main.humidity);

// // Convert the temp to fahrenheit
// var tempF = (response.main.temp - 273.15) * 1.80 + 32;

// // add temp content to html
// $(".temp").text("Temperature (K) " + response.main.temp);
// $(".tempF").text("Temperature (F) " + tempF.toFixed(2));

// // Log the data in the console as well
// console.log("Wind Speed: " + response.wind.speed);
// console.log("Humidity: " + response.main.humidity);
// console.log("Temperature (F): " + tempF);
