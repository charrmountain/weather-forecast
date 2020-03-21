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
          cityName.css("font-weight", "bold");
          var currentDate = moment().format('MMMM Do, YYYY');
          var date = $("<h5>").text(currentDate)
     
          //get temp in F
          var tempF = (result.main.temp - 273.15) * 1.8 + 32;
          
          //get icon code
          var iconCode = result.weather[0].icon
          //place in URL
          var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";

          //make new divs
          var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) +" °F");
          var wind = $("<p>").text("Wind Speed: " + result.wind.speed + " MPH");
          var humidity = $("<p>").text("Humidity: " + result.main.humidity + " %");
          var weatherIcon = $("<img>").attr('src', iconurl);
    
          //style
          temp.css("font-weight", "lighter");
          wind.css("font-weight", "lighter");
          humidity.css("font-weight", "lighter");

            //append to body
          $(".city").append(cityName,date, weatherIcon)
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
              var uvValue = $("<p>").text(uvNum)
              var uvIndex = $("<p>").text("UV Index: ");
              uvValue.css("font-weight", "lighter");
              uvIndex.css("font-weight", "lighter");
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
