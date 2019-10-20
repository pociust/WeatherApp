  let queryURL = '';
  let city = 'London';
  
  
  
  
  
  function searchCity() {

  queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=35b0242376c730106a1ead757ba5708a';


  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);






    
  });

  };


  searchCity();
