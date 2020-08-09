$(document).ready(function () {

    let today = moment();
    let currentWeatherDiv = $("#weather-intro");
    let zipCode;
    
    // create a stored array of zip codes
    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    $("#current-day").text(today.format("dddd | LL | h mm a"));

    // api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
    // https://openweathermap.org/forecast5#name5

    let apiKey = "e963e46c2f8cf92d1cc960a998d01e5d";


    let searchButton = $("#search-button");

    // Load weather data for most recent search when page is loaded
    $(window).on("load", getWeatherData(cityList[0]));

    // CLICK EVENT
    $(searchButton).on("click", function (event) {
        event.preventDefault();
        currentWeatherDiv.val();
        zipCode = $("#input-string").val().trim();
        getWeatherData(zipCode);
        $(".recently-searched").append($(`<li class="list-group-item searched-city">${zipCode}</li>`));

    });

    // Function to query the Weather API
    function getWeatherData(zip) {

        // get zip code 

        let queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                cityList.unshift(zip);
                localStorage.setItem("cityList", JSON.stringify(cityList));

                let lon = (response.coord.lon);
                let lat = (response.coord.lat);

                // to get the weather icon
                // http://openweathermap.org/img/wn/10d@2x.png

                let queryForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;

                $.ajax({
                    url: queryForecastURL,
                    method: "GET"
                })
                    .then(function (forecast) {
                        let weatherTodayIconEl = $('<img id="today-forecast-icon" src="https://openweathermap.org/img/wn/' + forecast.daily[0].weather[0].icon + '@2x.png" alt="weather icon"</img>');
                        let cityNameEl = $('<h2 id="city-name">' + response.name + '</h2>');
                        let degreesFEl = $('<p id="degrees-f">Temperature: ' + (forecast.current.temp * 9 / 5 - 459.67).toFixed(0) + 'F</p>');
                        let humidityEl = $('<p id="humidity">Humidity: ' + forecast.current.humidity + '% </p>');
                        let windSpeedEl = $('<p id="wind-speed">Wind Speed: ' + forecast.current.wind_speed + 'MPH</p>');
                        let uvIndexEl = $('<p id="uv-index">UV Index: ' + forecast.current.uvi + '</p>');
                        
                        $("#weather-intro").empty();

                        $("#weather-intro").append(cityNameEl, weatherTodayIconEl, degreesFEl, humidityEl, windSpeedEl, uvIndexEl);

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
                        let cardEl;
                        let forecastRowEl = $("#forecast-row");

                        forecastRowEl.empty();
                        now = moment().add(1, 'days');

                        for (i = 1; i < 6; i++) {
                            // card container
                            let cardDeckEl = $('<div class="card-deck"></div>');
                            let cardEl = $('<div class="card text-white bg-primary"></div>');
                            // card body
                            let cardBodyEl = $('<div class="card-body"></div>');
                            // sibling elements in the card body
                            let forecastDay = $('<p>' + now.format("MM/DD/YYYY") + '</p>');
                            let weatherIcon = $('<img id="forecast-icon" src="https://openweathermap.org/img/wn/' + forecast.daily[i].weather[0].icon + '@2x.png" alt="weather icon"</img>');
                            let forecastTempEl = $('<p id="card-text">Temp: ' + (forecast.daily[i].temp.day * 9 / 5 - 459.67).toFixed(0) + 'F</p>');
                            let forecastHumidityEl = $('<p id="card-text">Humidity: ' + forecast.daily[i].humidity + '% </p>');
                            let forecastColumn = $('<div class="col row-cols-md-2">');

                            cardBodyEl.append(forecastDay, weatherIcon, forecastTempEl, forecastHumidityEl);
                            cardDeckEl.append(cardEl);
                            cardEl.append(cardBodyEl);
                            forecastRowEl.append((forecastColumn.append(cardDeckEl)));
                            now.add(1, 'days');
                        }



// function so that when weather dashboard is opened, current
// forecast for most recently-searched city is displayeds

                    });
            });

    }

});