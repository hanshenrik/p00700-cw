$(document).ready(function() {
  var sep = ' // '

  $( '#infoIcon' ).click(function() {
    $( '#info' ).slideToggle()
  })

  $( '#semesterSelect' ).change(function() {
    var semesterFilter = $(this).val()
    if (semesterFilter == 'all') {
      $( '#selectable li' ).show()
    }
    else {
      semesterClass = 'sem' + semesterFilter
      $( '#selectable li.' + semesterClass ).show()
      $( '#selectable li' ).not( ' .' + semesterClass ).hide()
    }
  })

  $( '#selectAllFromCourseButton' ).click(function() {
    var sem = $( '#semesterSelect' ).val()
    if (sem == 'all') {
      $( '#semesterError' ).slideDown()
      $( '#semesterSelect' ).effect( 'highlight', 1000 )
    }
    else {
      $( '.ui-selected' ).removeClass('ui-selected') // unselects all
      $( '#schedule-table tbody tr' ).remove() // clears table
      $( '#selectable' ).selectable('refresh') // adds class ui-selectee to all li elements
      $( '#selectable li' ).each(function() {
        if (sem == $(this).text().split(sep)[1]) { // makes sure we only populate table with modules from this semester
          $(this).addClass('ui-selecting') // adds class ui-selecting to all elements
          $( '#selectable' ).data('ui-selectable')._mouseStop(null); // simulates the release of mouse click on all selectables
        }
      })
      
      $( '#semesterError' ).slideUp() // hides error if present
    }
  })

  // remove ui-selected class from all selected elements and clear table
  $( '#clearSelectionButton' ).click(function() {
    $( '.ui-selected' ).removeClass('ui-selected')
    $( '#schedule-table tbody tr' ).remove()
  })

  // display whole list of courses if search input is focused
  $('#autocomplete').focus(function(){
    $('#autocomplete').autocomplete('search', '')
  })
})
