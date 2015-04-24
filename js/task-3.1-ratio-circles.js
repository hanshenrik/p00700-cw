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
      // calculate male to total ratio (times 100 to get percent, toFixed(2) rounds to 2 decimal points)
      var ratio = parseFloat((districts[district].males/districts[district].population).toFixed(2)) * 100
      color = colors[ratio - 47] // TODO: ugly! fix

      var populationOptions = {
        strokeColor: '#000000',
        strokeOpacity: 0.77,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.7,
        map: map,
        center: districts[district].center,
        radius: Math.sqrt(districts[district].population) * 8
      }
      
      // add circle to map
      new google.maps.Circle(populationOptions)
    }
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'))
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
