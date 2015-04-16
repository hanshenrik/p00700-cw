$(document).ready(function() {
  // populate legend table
  for (i = 0; i < colors.length; i++) {
    var tr = document.createElement("tr")
    var tdColor = document.createElement("td")
    var tdRatio = document.createElement("td")
    
    tdColor.style.background = colors[i]
    var ratio = document.createTextNode((47 + i) + '%') // TODO: ugly. fix!

    tdRatio.appendChild(ratio)
    
    tr.appendChild(tdColor)
    tr.appendChild(tdRatio)
    $( '#color-ratio-table tbody' ).append(tr)
  }
})
