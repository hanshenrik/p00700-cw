$(document).ready(function() {
  var sep = ' // '
  var districts = {}
  var color

  function initialize() {
    var mapOptions = {
      center: { lat: 51.6, lng: -1},
      zoom: 9
    }

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)

    // create a circle for each district
    for (var district in districts) {
      // set colour based on district code
      color = (district.substring(0, 2) == 'OX') ? '#FF0000' : '#0000FF' // TODO: better colors

      var populationOptions = {
        strokeColor: color,
        strokeOpacity: 0.77,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.33,
        map: map,
        center: districts[district].center,
        radius: Math.sqrt(districts[district].population) * 8
      }
      
      // add circle to map
      new google.maps.Circle(populationOptions)
    }
  }

  $.ajax({
    type: "GET",
    url: "data/census_data.xml",
    dataType: "xml",
    success: function(xml) {
      $( xml ).find( 'postcode_district' ).each( function() {
        var pcdistrict = $( this ).attr( 'pcdistrict' )
        var lat = $( this ).attr( 'latitude' )
        var lng = $( this ).attr( 'longitude' )
        var total = $( this ).attr( 'number' )
        var males = $( this ).attr( 'males' )

        districts[pcdistrict] =  {
          center: new google.maps.LatLng(lat, lng),
          population: total,
          males: males
        }
      })

      // create the map with circles /after/ data is fetched
      google.maps.event.addDomListener(window, 'load', initialize())
    }
  })
})
