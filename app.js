let queryURL = "";
let city = "";

function searchCity() {
  queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=35b0242376c730106a1ead757ba5708a";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    let searchCityObject = {
      city: response.name,
      temp: response.main.temp,
      conditions: response.weather[0].description,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed
    };
    console.log("object", searchCityObject);
    // NEED to get local DATE and TIME

    // Might need to use different API to link to UV index using above information for coordinates to search uv api

    let searchCityCoordinates = response.coord;
    console.log("cordinate", searchCityCoordinates);

    displayCityInfo(searchCityObject);
  });
}

function displayCityInfo(searchCityObject) {
  let createDiv = $(
    `<h2>${searchCityObject.city}</h2><div>Temperature: ${searchCityObject.temp}°F</div><div>Humidity: ${searchCityObject.humidity}%</div><div>Wind: ${searchCityObject.windSpeed}MPH</div>`
  );
  $("#searched-city-info").html(createDiv);
}

$("#city-search").on("click", function() {
  city = $(":text").val();
  console.log("city:", city);
  searchCity();
});
