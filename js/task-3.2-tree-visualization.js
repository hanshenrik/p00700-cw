var tree = { total: 0 }
$(document).ready(function() {
  // regex to find letter part of code
  var re = /[A-Z]+/
  // var tree = { total: 0 }
  var sep = ' // '
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  
  function paintRectangle(startPoint, endPoint, color) {
    var x = startPoint[0]
    var y = startPoint[1]
    var width = endPoint[0] - x
    var height = endPoint[1] - y
    
    console.log('\trect x: ' + x)
    console.log('\trect y: ' + y)
    console.log('\trect width: ' + width)
    console.log('\trect height: ' + height)

    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    rect.setAttribute('x', x)
    rect.setAttribute('y', y)
    rect.setAttribute('width', width)
    rect.setAttribute('height', height)
    
    svg.appendChild(rect)
  }

  function treeMap(node, startPoint, endPoint, axis, color) { // object, [x1, y1], [x2, y2], 0, 'red'
    console.log(node + sep + startPoint + sep + endPoint + sep + axis + sep + color)
    console.log('painting...')
    paintRectangle(startPoint, endPoint, color)

    console.log('endPoint['+ axis +']: ' + endPoint[axis])
    console.log('startPoint[' +axis+']: ' + startPoint[axis])
    var width = endPoint[axis] - startPoint[axis] // compute location of next slice
    console.log('width: ' + width)

    for (var child in node) {
      console.log('\tchild: ' + child)
      if (child == 'total') continue
      var students = node[child]['total']
      if (students == undefined) { // leaf node
        students = node[child]
      }
      console.log('\tnode total: ' + node['total'] )
      console.log('\tstudents: ' + students)
      console.log('\t(students / node[total]) * width: ' + (students / node['total']) * width)
      
      endPoint[axis] = startPoint[axis] + ( students / node['total'] ) * width
      treeMap(node[child], startPoint, endPoint, 1 - axis, color)
      startPoint[axis] = endPoint[axis]
    }
  }

  function processTree() {
    console.log(tree)
    treeMap(tree, [0, 0], [300, 300], 0, 'white')
    $( 'body' ).append(svg)

    for (area in tree) {
      for (subarea in tree[area]) {
        // skip the total entry
        if (subarea == 'total') {
          continue
        }
        var ratio = tree[area][subarea] / tree[area]['total']
        console.log(subarea + ' : ' + tree[area][subarea])
        console.log(subarea + ' ratio : ' + ratio)
      }
    }
  }

  $.ajax({
    type: "GET",
    url: "data/students_pcd.xml",
    dataType: "xml",
    success: function(xml) {
      // for each postcode
      $( xml ).find('postcode_district').each(function() {
        // get postcode and number of students
        var code = $( this ).attr('pcdistrict')
        var students = parseInt($( this ).attr('number'))
        
        if (re.test(code)) { // could use code.match(re)
          // extract letter part of code
          var letters = code.match(re)[0]

          // if no entry exists for these letters, create an empty object to be filled
          if (!tree[letters]) {
            tree[letters] = { total: 0 }
          }
          tree[letters][code] = students
          tree[letters]['total'] += students
          tree['total'] += students
        } else {
          console.log('Format error in postcode "' + code + '")! Should begin with uppercase letters.')
        }
      })
      
      // processTree()
      console.log(tree)
    }
  })
})