var SCREENER_END_POINT = "https://api.intrinio.com/securities/search?conditions=";
var DATA_END_POINT = "https://api.intrinio.com/data_point?"
// var USER_NAME = "c14b322a4d960daf551ecf552c8ed84b";
// var PASS_WORD = "67344d263c0142633aa0ff8cb59a51d7";
var USER_NAME = "19d217274ddc3a86810e31e6309562f1";
var PASS_WORD = "17cd26d8fa01c6c71269471ae2653b39";

$(".filter-search-btn").click(function() {
  var data = get_data();
  $.ajax({
    type: "GET",
    url: SCREENER_END_POINT + data + "&page_size=15",

    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(USER_NAME + ":" + PASS_WORD));
    },

    success: function(msg) {
      if (msg.result_count != 0) {
        get_display_data(msg.data);  
      }
    },

    error: function(request, status, error) {
      console.log(error);
    }
  })
});

function get_data() {
  var result_array = []
  var filters = $(".filter-list").children(".filter-list-item");
  for (var i = 0; i < filters.length; i++) {
    var filter = $(filters[i]);
    if (!(filter.hasClass("country") || filter.hasClass("stock_exchange") || filter.hasClass("sector"))) {
      var tag = filter.attr("filter-tag");
      var condition = filter.find("select").val();
      var value = filter.find("input").val();
      result_array.push(tag + condition + value);
      continue;
    }

    var tag = filter.attr("filter-tag");
    var value = filter.find("select").val();
    result_array.push(tag + "~eq~" + value);
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

function append_numerical_filter(super_container, filter_tag, filter_name) {
  var template = '<li class="row list-group-item filter-list-item ' + filter_tag + '"' + 
  ' filter-tag="' + filter_tag + '">' + 
  '<div class="col-md-5 form-input-label">' + '<p>' + filter_name + '</p></div>' +
  '<div class="col-md-2">' + '<select class="form-control condition">' + 
  '<option value="~eq~">=</option>' +
  '<option value="~gt~">></option>' + 
  '<option value="~gte~">>=</option>' + 
  '<option value="~lt~"><</option>' + 
  '<option value="~lte~"><=</option>' +
  '</select></div>' + '<div class="col-md-4"><input type="number" class="form-control"></div>' +
  '<div class="col-md-1 filter-remove-btn">' + 
  '<button class="btn-sm btn-danger">x</button></div></li>';
  super_container.append(template);
  super_container.find(".btn-danger").click(function() {
    $($(this).parents(".filter-list-item")[0]).remove();
  });
}

function append_selection_filter(super_container, filter_tag, filter_name) {
  var template_before = '<li class="row list-group-item filter-list-item ' + filter_tag + 
  '" filter-tag="' + filter_tag + '">' +  
  '<div class="col-md-5 form-input-label">' + '<p>' + filter_name + '</p></div>' +
  '<div class="col-md-2"></div>' + '<div class="col-md-4"><select class="form-control select">'

  var template_after = '</select></div>' +
  '<div class="col-md-1 filter-remove-btn">' + 
  '<button class="btn-sm btn-danger">x</button></div></li>';

  if (filter_name == "Country") {
    for (var i = 0; i < countries.length; i++) {
      template_before = template_before + "<option value='" + countries[i] + "'>" + countries[i] + "</option>";
    }
  }

  if (filter_name == "Sector") {
    for (var i = 0; i < sectors.length; i++) {
      template_before = template_before + "<option value='" + sectors[i] + "'>" + sectors[i] + "</option>";
    }
  }

  if (filter_name == "Exchange") {
    for (var i = 0; i < exchanges.length; i++) {
      template_before = template_before + "<option value='" + exchanges[i] + "'>" + exchanges[i] + "</option>";
    }
  }

  var template = template_before + template_after
  super_container.append(template);
  super_container.find(".btn-danger").click(function() {
    $($(this).parents(".filter-list-item")[0]).remove();
  });
}


function setupCountries() {
  for (var i = 0; i < countries.length; i++) {
    $(".country").find(".select").append()
  }
}

function setupSectors() {
  for (var i = 0; i < sectors.length; i++) {
    $(".sector").find(".select").append("<option value='" + i + "'>" + sectors[i] + "</option>")
  }
}

function get_display_data(results) {
  var tickers = [];
  for (var i = 0; i < results.length; i++) {
    tickers.push(results[i].ticker);
  }

  var identifier = tickers.join(",");
  var items = "name,open_price,marketcap,stock_exchange,beta,pricetoearnings,roe,currentratio";
  
  var data_point_url = DATA_END_POINT + "identifier=" + identifier + "&item=" + items;
  $.ajax({
    type: "GET",
    url: data_point_url,

    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(USER_NAME + ":" + PASS_WORD));
    },

    success: function(msg) {
      var sanitized_data = sanitize_data(msg.data, tickers);
      display_result(sanitized_data);
    },

    error: function(request, status, error) {
      console.log(error);
    }
  });
}

function sanitize_data(raw, tickers) {
  var result = [];
  for (var i = 0; i < tickers.length; i++) {
    var ticker = tickers[i];
    var display_data = {};
    for (var j = 0; j < raw.length; j++) {
      if (raw[j].identifier == ticker) {
        display_data[raw[j].item] = raw[j].value;
      }
    }
    result.push([ticker, display_data]);
  }
  return result;
}

function display_result(sanitized_data) {
  var appended = "";
  for (var i = 0; i < sanitized_data.length; i++) {
    var template = '<li class="list-group-item result-list-item"><div class="row">';
    var data = sanitized_data[i];
    template = template + 
    '<div class="col-md-1">' + (i + 1) + '</div>' +
    '<div class="col-md-1">' + data[0] + '</div>' +
    '<div class="col-md-2">' + data[1].name + '</div>' +
    '<div class="col-md-1">' + get_price(data) + '</div>' +
    '<div class="col-md-1">' + get_marketcap(data) + '</div>' +
    '<div class="col-md-1">' + data[1].stock_exchange + '</div>' +
    '<div class="col-md-1">' + get_beta(data) + '</div>' +
    '<div class="col-md-1">' + get_pe(data) + '</div>' +
    '<div class="col-md-1">' + get_roe(data) + '</div>' +
    '<div class="col-md-1">' + get_current_ratio(data) + '</div>'
    template = template + '</div></li>'
    appended = appended + template;
  }
  $(".result-list-item").remove();
  $(".result-list").append(appended);
}

function get_price(data) {
  if (data[1].open_price != "na") {
    return data[1].open_price + " USD";
  }
  return data[1].open_price;
}

function get_marketcap(data) {
  if (data[1].marketcap != "nm") {
    return (data[1].marketcap / 1000000000).toFixed(2) + "B";
  }
  return data[1].marketcap;
}

function get_beta(data) {
  if (data[1].beta != undefined) {
    return data[1].beta.toFixed(2);
  }
  if (data[1].three_yr_weekly_beta != undefined) {
    return data[1].three_yr_weekly_beta.toFixed(2);
  }
  return "nm";
}

function get_pe(data) {
  if (data[1].pricetoearnings != "nm") {
    return data[1].pricetoearnings.toFixed(2);
  }
  return data[1].pricetoearnings;
}

function get_roe(data) {
  if (data[1].pricetoearnings != "na") {
    return (data[1].roe * 100).toFixed(2) + "%";
  }
  return data[1].roe;
}

function get_current_ratio(data) {
  if (data[1].currentratio != "na") {
    return (data[1].currentratio).toFixed(1);
  }
  return data[1].currentratio;
}