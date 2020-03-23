var localCity = localStorage.getItem("searchcity")

if ( localCity !== 'undefined' && localCity !== null){
    //page reloads old search persists
    var oldCity = localStorage.getItem("searchcity").trim();
    var city = JSON.parse(oldCity);
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+ 
    city +"&appid="+ APIKey;

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
    .then(function (result) {
        renderUVindex(result);
        renderCurrentWeather(result);
        renderForecast(result);
      });
 }

// Here we are building the URL we need to query the database
$("#search-button").on("click", function () {
    
    var searchTerm = $("#search-term").val()
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+ 
    searchTerm+"&appid="+APIKey;

    
    //store that data by settin it to local storage
    localStorage.setItem("searchcity", JSON.stringify(searchTerm));

    //get city name
    var newBtn = $("<button>");
    newBtn.text(searchTerm);
    newBtn.attr("class", "btn btn-light btn-lg btn-block");
    newBtn.attr("data-name", searchTerm);
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
      .then(function (result) {
          renderUVindex(result);
          renderCurrentWeather(result);
          renderForecast(result);
      });


$(newBtn).on("click", function (event) {
        var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
        var queryURL ="https://api.openweathermap.org/data/2.5/weather?q="+ 
        searchTerm +"&appid="+ APIKey;

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
        .then(function (result) {
            renderUVindex(result);
            renderCurrentWeather(result);
            renderForecast(result);
          });
     });
  });

  

  function renderCurrentWeather(result) {
          //city name
          var cityName = $("<h1>").text(result.name);
          cityName.css("font-weight", "bold");
          var currentDate = moment().format('MMMM Do, YYYY');
          var date = $("<h5>").text(currentDate)
     
          //get temp in F
          var tempF = (result.main.temp - 273.15) * 1.8 + 32;
          
          //get icon code
          var iconCode = result.weather[0].icon
          //place in URL
          var iconurl = "https://openweathermap.org/img/w/" + iconCode + ".png";

          //make new div
          var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) +" °F");
          var wind = $("<p>").text("Wind Speed: " + result.wind.speed + " MPH");
          var humidity = $("<p>").text("Humidity: " + result.main.humidity + " %");
          var weatherIcon = $("<img>").attr('src', iconurl);
    
          //style
          temp.css("font-weight", "lighter");
          wind.css("font-weight", "lighter");
          humidity.css("font-weight", "lighter");

            //append to body
          $(".city").append(cityName , date)
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
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat="+ lat +"&lon=" + lon
    
    $.ajax({
        url: queryURL,
        method: "GET"
        })
          .then(function (response) {
              var uvBtn = $("<button>")
              var uvNum = response.value
              uvBtn.text(uvNum)
              var uvIndex = $("<p>").text("UV Index: ");
              uvBtn.css("font-weight", "bold");
              uvIndex.css("font-weight", "lighter");
            
              //UV colors
            if (uvNum <= 2){
                uvBtn.attr("class", "btn btn-success");
    

            }else if (uvNum <= 5){
                uvBtn.attr("class", "btn btn-warning");
               

            }else if (uvNum <= 7){
                uvBtn.attr("class", "btn btn-danger");
                

            }else if (uvNum <= 10){
                uvBtn.attr("class", "btn btn-info");
               

            }else if (uvNum >= 11){
                uvBtn.attr("class", "btn btn-primary");
    
            }

            $(".uvIndex").append(uvIndex);
            $(".uv-button").append(uvBtn);
          });
    };

//5 day forecast
function renderForecast(result){

    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    //get long/lat for UV url
    var cityName = result.name;
    //UV place UFL
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +cityName+ "&appid="+ APIKey
    
    $.ajax({
        url: queryURL,
        method: "GET"
        })
          .then(function (response) {
             for( var i = 0; i <5; i++) {
                //date
                var DaysForward = new moment().add(i+1, 'day');
                var getDay = (DaysForward).format('dddd');
                var date = $("<h1>").text(getDay)
                //get 5 days to print
                newCard = $("<div class='card'>");
                newCardBody =$("<div class='card-body'>")
                //date
                // var dateForecast = response.list[0].sys.dt_txt
                //icon
                var iconForecastCode = response.list[i].weather[0].icon
                // temp
                var tempForecast = response.list[i].main.temp
                //humidity
                var humidityForecast = response.list[i].main.humidity

                    
                //get temp in F
                var tempFForecast = (tempForecast - 273.15) * 1.8 + 32;
                
                //place in URL
                var iconurlForecast = "https://openweathermap.org/img/w/" + iconForecastCode  + ".png";

                //make new div
                var temp = $("<p>").text("Temperature: " + tempFForecast.toFixed(2) +" °F");
                var humidity = $("<p>").text("Humidity: " + humidityForecast + " %");
                var weatherIcon = $("<img>").attr('src', iconurlForecast);

                //append
                newCardBody.append(date);
                newCardBody.append(weatherIcon);
                newCardBody.append(temp);
                newCardBody.append(humidity);

                newCard.append(newCardBody)
                newCard.css("margin", "0");
                newCard.css("padding", "0");
                newCard.css("background-color", "rgb(0, 153, 255)");
                newCard.css("color", "white");

                $(".current-weather").append(newCard); 
             }
         });
     };