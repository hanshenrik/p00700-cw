$(document).ready(function() {
  var courseCodeTranslation = {'Comp': 'Computing', 'CS': 'Computer Science', 'SE': 'Software Engineering', 'CV': 'Computer Vision', 'EB': 'eBusiness'}
  var courseList = []
  var sep = ' // '
  var indexOffsetWeeks = 2  // Week 1 should be in column 3 in #schedule-table.
                            // Weeks in data source are given 1-indexed.
                            // E.g. if coursework starts in week 1:
                            // 1 (from data source) + 2 (offset) = 3 (table index)

  function createScheduleTableRow(courseworkNode) {
    var tr = document.createElement("tr")
    
    var tdCode = document.createElement("td")
    var tdAssignment = document.createElement("td")
    var tdMarks = document.createElement("td")
    
    var code = document.createTextNode(courseworkNode.find('title').text()) // can use code from before
    var assignment = document.createTextNode(courseworkNode.find('assignment').text())
    var marks = document.createTextNode(courseworkNode.find('marks').text())

    if (marks.textContent == 'formative') {
      marks.textContent = '-'
    }
    
    tdCode.appendChild(code)
    tdAssignment.appendChild(assignment)
    tdMarks.appendChild(marks)
    
    tr.appendChild(tdCode)
    tr.appendChild(tdAssignment)
    tr.appendChild(tdMarks)
    
    // create week and exam cells
    for (i = 0; i < 13; i++) {
      tr.appendChild(document.createElement("td"))
    }

    // colour weeks/exam cells affected by this coursework
    var start = parseInt(courseworkNode.attr('start'))
    var end = parseInt(courseworkNode.attr('end'))
    for (i = start + indexOffsetWeeks; i < end + indexOffsetWeeks + 1; i++) {
      tr.childNodes[i].className = "busy"
    }

    return tr
  }

  // get all courses from data_msc.xml, add them to list and initialize autocomplete input
  $.ajax({
    type: "GET",
    url: "data/data_msc.xml",
    dataType: "xml",
    success: function(xml) {
      // add each code to coursesList
      $(xml).find('course').each(function() {
        var code = $(this).attr('code')
        if (courseCodeTranslation[code]) {
          courseList.push(courseCodeTranslation[code] + sep + code)
        }
      })

      // set the autocomplete functionality to #autocomplete
      $( '#autocomplete' ).autocomplete({
        source: courseList,
        minLength: 0,
        select: function(event, ui) {
          // clear list of modules if it has items
          if ( $( '#selectable li' ).length > 0 ) {
            $( '#selectable' ).empty()
          }

          var code = ui.item.label.split(sep)[1]
          // get all modules from selected course, create selectable list
          $( xml ).find('course[code="' + code + '"]').find('mod').each(function() {
            var number = $(this).attr('number')
            var semester = $(this).attr('semester')
            var status = $(this).attr('status')
            var classes = 'ui-widget-content sem' + semester
            if (status == 'C') classes += ' compulsory'

            $( '#selectable').append('<li class="' + classes + '">' + number + sep + semester + sep + status + '</li>')
          })

          // trigger change() on #semester to apply semester filter
          $( '#semesterSelect' ).change()
        }
      })
      
      // // trigger autocomplete search to display the list of courses automatically (can be annoying)
      // $("#autocomplete").autocomplete('search', '')

      // handle selections in the module list
      $( '#selectable' ).selectable({
        stop: function() { // called on mouse up
          // clear table
          $( '#schedule-table tbody tr' ).remove()
          
          // repopulate table based on selection
          $( '.ui-selected' ).each(function() {
            var code = $(this).text().split(sep)[0]
            var semester = $(this).text().split(sep)[1]
            $( xml ).find('module[code="' + code + '"]').find('coursework').each(function() {
              // make sure we only add modules for the semester specified in the #selectable li
              // element, since there exists modules with the same code for different semesters
              if (semester == $(this).find('semester').text()) {
                var tr = createScheduleTableRow($(this))
                $( '#schedule-table tbody' ).append(tr)
              }
            })                    
          })
        }
      })
    }
  })
  
  $( '#selectAllButton' ).click(function() {
    // clear table
    $( '#schedule-table tbody tr' ).remove()
    
    $.ajax({
      type: "GET",
      url: "data/data_msc.xml",
      dataType: "xml",
      success: function(xml) {
        // add coursework from /all/ module tags to #schedule-table
        $(xml).find('module').each(function() {
          $(this).find('coursework').each(function() {
            var tr = createScheduleTableRow($(this))
            $( '#schedule-table tbody' ).append(tr)
          })
        })
      }
    })
  })
})
