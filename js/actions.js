var END_POINT = "https://api.intrinio.com/securities/search?conditions=";
var USER_NAME = "c14b322a4d960daf551ecf552c8ed84b";
var PASS_WORD = "67344d263c0142633aa0ff8cb59a51d7";

$(".filter-search-btn").click(function() {
  var fundamental_data = get_fundamental_data();
  $.ajax({
    type: "GET",
    url: END_POINT + fundamental_data,

    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(USER_NAME + ":" + PASS_WORD));
    },

    success: function(msg) {
      console.log(msg);
    },

    error: function(request, status, error) {
      console.log(error);
    }
  })
});

function get_fundamental_data() {
  var result_array = []
  for (var i = 0; i < fundamental_filter_tags.length; i++) {
    var input_area = $("." + fundamental_filter_tags[i]);
    
    // error checking

    var parsed_term = parse_number_range_query(
      get_lower_value(input_area), 
      get_higher_value(input_area), 
      fundamental_filter_tags[i]);
    if (parsed_term == "") { continue; }
    result_array.push(parsed_term);
  }

  return result_array.join(",");
}

function get_lower_value(input_area) {
  var value = $(input_area.find(".lower-val input")[0]).val();
  if (value == "") { return null; }
  return value
}

function get_higher_value(input_area) {
  var value = $(input_area.find(".higher-val input")[0]).val();
  if (value == "") { return null; }
  return value
}

function parse_number_range_query(lower_val, higher_val, field) {
  var result_array = [];
  if (lower_val) { result_array.push(field + "~gte~" + lower_val); }
  if (higher_val) { result_array.push(field + "~lte~" + higher_val); }
  return result_array.join(",");
}