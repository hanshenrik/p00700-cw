$(document).ready(function() {
  var deadlinesCount = []
  var sep = ' // '

  function drawCanvas() {
    var canvas = document.getElementById('courseSummaryHistogram')
    var context = canvas.getContext('2d')
    var canvasSizeX = parseInt($( '#courseSummaryHistogram' ).attr('width'))
    var canvasSizeY = parseInt($( '#courseSummaryHistogram' ).attr('height'))
    var barXsize = 15
    var barXstart = 30
    var barX = barXstart
    var yMax = Math.max.apply(null, deadlinesCount)
    var barYscale = (yMax > 9) ? 15 : 30  // use less y space per deadline if there are loads of
                                          // deadlines in one week to avoid drawing outside canvas
    var barYstart = (yMax + 1) * barYscale
    var course = $( '#autocomplete' ).val().split(sep)[0]
    var semester = $( '#semesterSelect' ).val()

    context.fillStyle = $( 'body' ).css('background-color')
    context.fillRect(0, 0, canvasSizeX, canvasSizeY)
    
    context.fillStyle = 'rgb(0, 0, 0)'
    context.font = '16px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'top'
    context.fillText(course + ' semester ' + semester, canvasSizeX / 2, 0)
    context.font = '10px sans-serif'
    
    for (i in deadlinesCount) {
      // draw bar
      context.fillStyle = 'rgb(158, 171, 5)'
      context.fillRect(barX, barYstart - barYscale*deadlinesCount[i], barXsize, barYscale*deadlinesCount[i])
      
      // add x-axis labels
      context.fillStyle = 'rgb(0, 0, 0)'
      context.save()
        context.translate(barX + 12, barYstart + 8)
        context.rotate(0.7)
        if (i == 12) { // write 'exam' instead of 13
          context.fillText('exam', 0, 0)
        } else {
          context.fillText(parseInt(i) + 1, 0, 0)
        }
      context.restore()
      barX += 2*barXsize
    }

    // draw axes
    context.beginPath()
    context.moveTo(barXstart - 10, 10)
    context.lineTo(barXstart - 10, barYstart + 10)
    context.moveTo(barXstart - 20, barYstart)
    context.lineTo(barX, barYstart)
    context.stroke()

    // draw tick marks on y-axis
    for (i = 1; i <= yMax; i++) {
      context.moveTo(barXstart - 15, barYstart - barYscale*i)
      context.lineTo(barXstart - 5, barYstart - barYscale*i)
      context.stroke()

      // add y-axis labels
      context.fillStyle = 'rgb(0, 0, 0)'
      context.save()
        context.textBaseline = 'middle'
        context.translate(barXstart - 26, barYstart - barYscale*i)
        context.fillText(i, 0, 0)
      context.restore()
    }
  }

  $( '#courseSummaryButton' ).click(function() {
    $( '#canvas-wrapper' ).slideUp(function() {
      // initialize/clear deadlinesCount to avoid cumulative values
      for (i = 0; i < 13; i++) deadlinesCount[i] = 0
      $.ajax({
        type: "GET",
        url: "data/data_msc.xml",
        dataType: "xml",
        success: function(xml) {
          var semesterFilter = $( '#semesterSelect' ).val()
          if (semesterFilter == 'all') {
            $( '#semesterError' ).slideDown()
            $( '#semesterSelect' ).effect( 'highlight', 1000 )
            return
          }
          $( '#semesterError' ).slideUp()
          $( '#selectable li' ).each(function() {
            var modCode = $(this).text().split(' ')[0]
            var sem = $(this).text().split(' ')[2]
            if (sem == semesterFilter) {
              $( xml ).find('module[code="' + modCode + '"]').find('coursework').each(function() {
                if (sem == $(this).find('semester').text()) {
                  var end = parseInt($(this).attr('end'))
                  deadlinesCount[end-1] += 1
                }
              })
            }
          })
          drawCanvas()
          $( '#canvas-wrapper' ).slideDown()
        }
      })
    })
  })
})
