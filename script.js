// Here we are building the URL we need to query the database
$("#search-button").on("click", function () {
    var searchTerm = $("#search-term").val()
    var APIKey = "82fdd99a86105b66de45ae6fa55be58f";
    var queryURL ="http://api.openweathermap.org/data/2.5/weather?q="+ 
    searchTerm+"&appid="+APIKey;

    $.ajax({
    url: queryURL,
    method: "GET"
    })
      .then(function (result) {
          console.log(result)
          $(".city").text(result.name);
          
          //get temp in F
          var tempF = (result.main.temp - 273.15) * 1.8 + 32;

          $(".temp").text("Temperature: " + tempF.toFixed(2) +" °F");
          $(".wind").text("Wind Speed: " + result.wind.speed + " MPH");
          $(".humidity").text("Humidity: " + result.main.humidity + " %");
          renderWeatherIcons();
      });
  });
