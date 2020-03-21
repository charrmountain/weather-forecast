// Here we are building the URL we need to query the database
$("#search-button").on("click", function () {
    
    var searchTerm = $("#search-term").val()
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL ="http://api.openweathermap.org/data/2.5/weather?q="+ 
    searchTerm+"&appid="+APIKey;
    $(".city").empty();
    $(".temp").empty();
    $(".wind").empty();
    $(".humidity").empty();
    $(".uvIndex").empty();

    $.ajax({
    url: queryURL,
    method: "GET"
    })
      .then(function (result) {
          console.log(result)
          renderUVindex(result);
          renderCurrentWeather(result);
      });
  });

  function renderCurrentWeather(result) {
          //city name
          var cityName = $("<h1>").text(result.name);
          //get temp in F
          var tempF = (result.main.temp - 273.15) * 1.8 + 32;
          
          //get icon code
          var iconCode = result.weather[0].icon
          //place in URL
          var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";

          //make new divs
          var temp = $("<h5>").text("Temperature: " + tempF.toFixed(2) +" °F");
          var wind = $("<h5>").text("Wind Speed: " + result.wind.speed + " MPH");
          var humidity = $("<h5>").text("Humidity: " + result.main.humidity + " %");
          var weatherIcon = $("<img>").attr('src', iconurl);
    
            //append to body
          $(".city").append(cityName,weatherIcon)
          $(".temp").append(temp)
          $(".wind").append(wind)
          $(".humidity").append(humidity)
  };

  //have to get query UV 
  function renderUVindex(result) {

    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    //get long/lat for UV url
    var lon = result.coord.lon
    console.log(lon)
    var lat = result.coord.lat
    //UV place UFL
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat="+ lat +"&lon=" + lon
    
    $.ajax({
        url: queryURL,
        method: "GET"
        })
          .then(function (response) {
              console.log(response)
              var uvBtn = $("<button>")
              var uvNum = response.value
              var uvValue = $("<h5>").text(uvNum)
              var uvIndex = $("<h5>").text("UV Index: ");
              uvBtn.append(uvValue);
            
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
            $(".uvIndex").append(uvBtn);
          });
    };
