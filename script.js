var localCity = localStorage.getItem("searchcity")

if (localCity !== 'undefined' && localCity !== null) {
    //page reloads old search persists
    var oldCity = localStorage.getItem("searchcity").trim();
    var city = JSON.parse(oldCity);
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid=" + APIKey;

    $(".city").empty();
    $(".temp").empty();
    $(".wind").empty();
    $(".humidity").empty();
    $(".uvIndex").empty();
    $(".uv-button").empty();
    $(".weather-icon").empty();
    $(".current-weather").empty();

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(result) {
            renderUVindex(result);
            renderCurrentWeather(result);
            renderForecast(result);
        });
}

// Here we are building the URL we need to query the database
$("#search-button").on("click", function() {

    var searchTerm = $("#search-term").val()
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchTerm + "&appid=" + APIKey;


    //store that data by settin it to local storage
    localStorage.setItem("searchcity", JSON.stringify(searchTerm));

    //get city name
    var newBtn = $("<button>");
    newBtn.text(searchTerm);
    newBtn.attr("class", "uk-button uk-button-default");
    newBtn.attr("data-name", searchTerm);
    newBtn.css("font-family", "'Abril Fatface', cursive");
    $(".cities").prepend(newBtn);

    $(".city").empty();
    $(".temp").empty();
    $(".wind").empty();
    $(".humidity").empty();
    $(".uvIndex").empty();
    $(".uv-button").empty();
    $(".weather-icon").empty();
    $(".current-weather").empty();

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(result) {
            renderUVindex(result);
            renderCurrentWeather(result);
            renderForecast(result);
        });


    $(newBtn).on("click", function(event) {
        var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
            searchTerm + "&appid=" + APIKey;

        $(".city").empty();
        $(".temp").empty();
        $(".wind").empty();
        $(".humidity").empty();
        $(".uvIndex").empty();
        $(".uv-button").empty();
        $(".weather-icon").empty();
        $(".current-weather").empty();

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(result) {
                renderUVindex(result);
                renderCurrentWeather(result);
                renderForecast(result);
            });
    });
});



function renderCurrentWeather(result) {

    //city name font-family: 'Satisfy', cursive;
    var cityName = $("<h1>").text(result.name);
    cityName.css("font-family", "bold");
    cityName.css("font-family", "'Abril Fatface', cursive");
    var currentDate = moment().format('MMMM Do, YYYY');
    var date = $("<h5>").text(currentDate)

    //get temp in F
    var tempF = (result.main.temp - 273.15) * 1.8 + 32;

    //get icon code
    var iconCode = result.weather[0].icon
        //place in URL
    var iconurl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    //make new div
    var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
    var wind = $("<p>").text("Wind Speed: " + result.wind.speed + " MPH");
    var humidity = $("<p>").text("Humidity: " + result.main.humidity + " %");
    var weatherIcon = $("<img>").attr('src', iconurl);

    //style
    temp.css("font-weight", "lighter");
    wind.css("font-weight", "lighter");
    humidity.css("font-weight", "lighter");

    //append to body
    $(".city").append(cityName, date)
    $(".weather-icon").append(weatherIcon)
    $(".temp").append(temp)
    $(".wind").append(wind)
    $(".humidity").append(humidity)

};

//have to get query UV 
function renderUVindex(result) {

    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    //get long/lat for UV url
    var lon = result.coord.lon
    var lat = result.coord.lat
        //UV place UFL
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            var uvBtn = $("<span>")
            var uvNum = response.value
            uvBtn.text(uvNum)
            var uvIndex = $("<p>").text("UV Index: ");
            uvBtn.css("font-weight", "bold");
            uvIndex.css("font-weight", "lighter");

            //UV colors
            if (uvNum <= 2) {
                uvBtn.attr("class", "uk-label uk-label-success");


            } else if (uvNum <= 5) {
                uvBtn.attr("class", "uk-label uk-label-success");


            } else if (uvNum <= 7) {
                uvBtn.attr("class", "uk-label uk-label-warning");


            } else if (uvNum <= 10) {
                uvBtn.attr("class", "uk-label uk-label-danger");


            } else if (uvNum >= 11) {
                uvBtn.attr("class", "uk-label");

            }

            $(".uvIndex").append(uvIndex);
            $(".uv-button").append(uvBtn);
        });
};

// //5 day forecast
function renderForecast(result) {
    console.log(result)
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    //get long/lat for UV url
    var cityName = result.name;
    //UV place UFL
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            for (var i = 0; i < 5; i++) {
                //date
                var DaysForward = new moment().add(i + 1, 'day');
                var getDay = (DaysForward).format('dddd');
                var date = $("<h2 class='uk-card-title'>").text(getDay)
                    //get 5 days to print
                    // var newCard = $("<div class='uk-card'>");
                var newCardBody = $("<div class='uk-card uk-card-default uk-flex uk-flex-center uk-flex-middle'>")

                // //date
                // var dateForecast = response.list[0].sys.dt_txt
                //icon
                var iconForecastCode = response.list[i + 8].weather[0].icon
                    // temp
                var tempForecast = response.list[i + 8].main.temp
                    //humidity
                var humidityForecast = response.list[i + 8].main.humidity

                //get temp in F
                var tempFForecast = (tempForecast - 273.15) * 1.8 + 32;

                //place in URL
                var iconurlForecast = "https://openweathermap.org/img/wn/" + iconForecastCode + "@2x.png";

                //make new div
                var temp = $("<p>").text(tempFForecast.toFixed(2) + " °F");
                var humidity = $("<p>").text("Humidity: " + humidityForecast + " %");

                var weatherIcon = $("<img>").attr('src', iconurlForecast);
                date.css("font-family", "'Abril Fatface', cursive")
                temp.css("font-size", "30px")

                weatherIcon.css("font-size", "15px")

                //append
                newCardBody.append(date);
                newCardBody.append(weatherIcon);
                newCardBody.append(temp);


                newCardBody.attr("text-align", "center")
                newCardBody.css("align-content", "center")
                newCardBody.css("margin", "5px");

                $(".current-weather").append(newCardBody);
            }
        });
};