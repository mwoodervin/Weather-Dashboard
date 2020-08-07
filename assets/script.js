$(document).ready(function () {

    let today = moment();
    // console.log(today);
    let currentWeatherDiv = $("#weather-intro");

    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    $("#current-day").text(today.format("dddd | LL | h mm a"));

    // api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
    // https://openweathermap.org/forecast5#name5

    let apiKey = "e963e46c2f8cf92d1cc960a998d01e5d";


    let searchButton = $("#search-button");

    // CLICK EVENT
    $(searchButton).on("click", function (event) {
        event.preventDefault();
        currentWeatherDiv.val();
        let zipCode = $("#input-string").val().trim();
        getWeatherData(zipCode);

    });
    getWeatherData("03885"); 

    // Function to query the Weather API
    function getWeatherData(zip) {

        // get zip code 

        // console.log(zipCode);

        let queryURL = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&appid=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                cityList.push(zip);
                localStorage.setItem("cityList", JSON.stringify(cityList));

                let lon = (response.coord.lon);
                let lat = (response.coord.lat);

                console.log(response.weather[0].icon);
                // to get the weather icon
                // http://openweathermap.org/img/wn/10d@2x.png

                // console.log(((response.main.temp) * 9 / 5 - 459.67).toFixed(0));
                let queryForecastURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey;

                $.ajax({
                    url: queryForecastURL,
                    method: "GET"
                })
                    .then(function (forecast) {

                        console.log(forecast);
                        let cityNameEl = $('<h2 id="city-name">' + response.name + '</h2>');
                        // let weatherIcon = $('<i id="weather-icon"></i>');
                        let degreesFEl = $('<p id="degrees-f">Temperature: ' + (forecast.current.temp * 9 / 5 - 459.67).toFixed(0) + 'F</p>');
                        let humidityEl = $('<p id="humidity">Humidity: ' + forecast.current.humidity + '% </p>');
                        let windSpeedEl = $('<p id="wind-speed">Wind Speed: ' + forecast.current.wind_speed + 'MPH</p>');
                        let uvIndexEl = $('<p id="uv-index">UV Index: ' + forecast.current.uvi + '</p>');
                        
                        $("#weather-intro").empty();

                        $("#weather-intro").append(cityNameEl, degreesFEl, humidityEl, windSpeedEl, uvIndexEl);

                        // color coding for UV Index
                        let uvIndex = forecast.current.uvi;

                        if (uvIndex <= 2) {
                            uvIndexEl.css("color", "green")
                        }
                        else if (uvIndex > 2 && uvIndex <= 5) {
                            uvIndexEl.css("color", "yellow")
                        }
                        else if (uvIndex > 5 && uvIndex <= 7) {
                            uvIndexEl.css("color", "orange")
                        }
                        else if (uvIndex > 7 && uvIndex <= 10) {
                            uvIndexEl.css("color", "red")
                        }
                        else if (uvIndex > 10) {
                            uvIndexEl.css("color", "purple")
                        }

                        // build forecast block
                        // let emptyDiv = $('<div class="col-md-2">');
                        let beginColumnEl = $('<div class="col-md-1">');
                        let endColumnEl = $('<div class="col-md-1">');
                        let cardEl;
                        let ForecastRowEl = $("#forecast-row");

                        ForecastRowEl.empty();

                        ForecastRowEl.append(beginColumnEl);

                        for (i = 1; i < 6; i++) {
                            // card container
                            let cardEl = $('<div class="card"></div>');
                            // card body
                            let cardBodyEl = $('<div class="card-body"></div>');
                            // sibling elements in the card body
                            let forecastDay = $('<p>Today</p>');
                            let weatherIcon = $('<img id="forecast-icon" src="http://openweathermap.org/img/wn/' + forecast.daily[i].weather[0].icon + '@2x.png" alt="weather icon"</img>');
                            let forecastTempEl = $('<p id="card-text">Temperature: ' + (forecast.daily[i].temp.day * 9 / 5 - 459.67).toFixed(0) + 'F</p>');
                            let forecastHumidityEl = $('<p id="card-text">Humidity: ' + forecast.daily[i].humidity + '% </p>');
                            let forecastColumn = $('<div class="col col-md-2">');

                            cardBodyEl.append(forecastDay, forecastTempEl, forecastHumidityEl);
                            cardEl.append(weatherIcon, cardBodyEl);
                            ForecastRowEl.append((forecastColumn.append(cardEl)));

                        }

                        ForecastRowEl.append(endColumnEl);


                        // loop through forecast appending columns
                        /* <div class="col-md-2"> = variable
                        <div class="card"></div> = variable
                        <!-- <img class="card-img-top" alt="Card image cap"> -->
                        <div class="card-body"> = variable
                            <p>Date</p> = variable
                            <p><i class="conditions"></i>weather logo</p>
                            <p class="card-text">Temp: </p>
                            <p class="card-text">Humidity</p>
                            then start appending the <p> to the card-body - line 109
                            then append card-body to card - line 110
                            then append card to col-md-2 - line 113
                            then append col-md-2 to forecast-row - line 114
                        </div>
                        </div> */


// still have to add recently searched cities to column on left
// function so that when weather dashboard is opened, current
// forecast for most recently-searched city is displayeds

                    });
            });

    }

});