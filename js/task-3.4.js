var e

google.load('visualization', '1', { packages:['treemap'] })
google.setOnLoadCallback(drawChart)

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Location', 'Parent', 'Students', 'Color'],
    ['UK',        null,       500,           0],
    ['OX',       'UK',        100,           0],
    ['OX12',     'OX',         50,           2],
    ['OX14',     'OX',         50,           4],
    ['LA',       'UK',        100,           0],
    ['LA2',      'LA',         25,           8],
    ['LA23',     'LA',         75,          10],
    ['S',        'UK',        300,           0],
    ['S40',      'S',         150,          14],
    ['S1',       'S',         150,          16]
  ])

  tree = new google.visualization.TreeMap(document.getElementById('treeMapContainer'))

  var options = {
    minColor: 'red',
    midColor: 'green',
    maxColor: 'blue',
    headerHeight: 22,
    fontColor: 'black',
    fontSize: 14,
    generateTooltip: showFullTooltip
  }

  function showFullTooltip(row, size, value) {
    return '<div class="tooltip">' + data.getColumnLabel(2) + ': ' + data.getValue(row, 2) + '</div>'
  }


  // google.visualization.events.addListener(tree, 'onmouseover', function() {
  //   var selection = tree.getSelection()
  //   e = event
  //   console.log(event)
  //   console.log(selection)
  // })

  tree.draw(data, options)
}