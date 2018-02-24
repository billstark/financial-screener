var SCREENER_END_POINT = "https://api.intrinio.com/securities/search?conditions=";
var DATA_END_POINT = "https://api.intrinio.com/data_point?"
// var USER_NAME = "c14b322a4d960daf551ecf552c8ed84b";
// var PASS_WORD = "67344d263c0142633aa0ff8cb59a51d7";
// var USER_NAME = "19d217274ddc3a86810e31e6309562f1";
// var PASS_WORD = "17cd26d8fa01c6c71269471ae2653b39";
var USER_NAME = "2411c63d180b6ca5e0881b730355032e";
var PASS_WORD = "1112212e5f469c61ec9de5ee3ce6b16a";

function display(element) {
  if (element.hasClass("hidden")) {
    element.removeClass("hidden");
  }
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 500);
}

function hide(element) {
  if (!element.hasClass("hidden")) {
    element.addClass("hidden");
  }
}

$(".filter-search-btn").click(function() {
  var data = get_data();
  hide($(".search-result"));
  hide($(".no-result"));
  display($(".spinner"));
  $.ajax({
    type: "GET",
    url: SCREENER_END_POINT + data[0] + "&page_size=15",

    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(USER_NAME + ":" + PASS_WORD));
    },

    success: function(msg) {
      if (msg.result_count == 0) {
        hide($(".spinner"));
        display($(".no-result"));
        return;
      }
      get_display_data(msg.data, data[1], data[2], data[3]);
    },

    error: function(request, status, error) {
      console.log(error);
    }
  });
});

function get_data() {
  var result_array = [];
  var extra_filters = [];
  var filter_names = [];
  var units = [];
  var filters = $(".filter-list").children(".filter-list-item");
  for (var i = 0; i < filters.length; i++) {
    var filter = $(filters[i]);
    if (!(filter.hasClass("country") || filter.hasClass("stock_exchange") || filter.hasClass("sector"))) {
      var tag = filter.attr("filter-tag");
      var condition = filter.find("select").val();
      var value = filter.find("input").val();
      var unit = filter.attr("filter-unit");

      if (unit == "%") {
        value = value / 100;
      }

      if (unit == "USD(mn)" || unit == "mn") {
        value = value * 1000000;
      }
      result_array.push(tag + condition + value);
      if (tag != "name" && tag != "pricetoearnings" && tag != "marketcap" && extra_filters.indexOf(tag) == -1) {
        extra_filters.push(tag);
        units.push(unit);
        filter_names.push(filter.find("p").text());
      }
      continue;
    }

    var tag = filter.attr("filter-tag");
    var value = filter.find("select").val();
    result_array.push(tag + "~eq~" + value);
    if (tag != "name" && tag != "pricetoearnings" && tag != "marketcap" && extra_filters.indexOf(tag) == -1) {
      extra_filters.push(tag);
      filter_names.push(filter.find("p").text());
    }
  }

  return [result_array.join(","), extra_filters, units, filter_names];
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

function append_numerical_filter(super_container, filter_tag, filter_name, filter_unit) {
  var template = '<li class="row list-group-item filter-list-item ' + filter_tag + '"' + 
  ' filter-tag="' + filter_tag + 
  '" filter-unit="' + filter_unit + '">' + 
  '<div class="col-md-5 form-input-label">' + '<p>' + filter_name + '</p></div>' +
  '<div class="col-md-2">' + '<select class="form-control condition">' + 
  '<option value="~eq~">=</option>' +
  '<option value="~gt~">></option>' + 
  '<option value="~gte~">>=</option>' + 
  '<option value="~lt~"><</option>' + 
  '<option value="~lte~"><=</option>' +
  '</select></div>' + '<div class="col-md-3 filter-input"><input type="number" class="form-control"></div>' +
  '<div class="col-md-1 filter-unit">' + filter_unit + '</div>' +
  '<div class="col-md-1 filter-remove-btn">' + 
  '<button class="btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button></div></li>';
  super_container.append(template);
  super_container.find(".btn-danger").click(function() {
    $($(this).parents(".filter-list-item")[0]).remove();
  });
}

function append_selection_filter(super_container, filter_tag, filter_name) {
  var template_before = '<li class="row list-group-item filter-list-item ' + filter_tag + 
  '" filter-tag="' + filter_tag + '">' +  
  '<div class="col-md-5 form-input-label">' + '<p>' + filter_name + '</p></div>' +
  '<div class="col-md-2"></div>' + '<div class="col-md-3 filter-input"><select class="form-control select">';

  var template_after = '</select></div>' + '<div class="col-md-1"></div>' +
  '<div class="col-md-1 filter-remove-btn">' + 
  '<button class="btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button></div></li>';

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

function get_display_data(results, extra_filters, extra_units, extra_filter_names) {
  var tickers = [];
  for (var i = 0; i < results.length; i++) {
    tickers.push(results[i].ticker);
  }

  var identifier = tickers.join(",");
  var default_items = ["name", "marketcap", "pricetoearnings"];
  var default_units = ["", "USD(mn)", "x"];
  var default_fitler_names = ["#", "Ticker", "Stock Name", "Market Cap", "P/E Ratio"]
  var items = default_items.concat(extra_filters);
  var units = default_units.concat(extra_units);
  var names = default_fitler_names.concat(extra_filter_names);

  // var items = "name,open_price,marketcap,stock_exchange,beta,pricetoearnings,roe,currentratio";
  
  var data_point_url = DATA_END_POINT + "identifier=" + identifier + "&item=" + items.join(",");

  $.ajax({
    type: "GET",
    url: data_point_url,

    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(USER_NAME + ":" + PASS_WORD));
    },

    success: function(msg) {
      var sanitized_data = sanitize_data(msg.data, tickers);
      hide($(".spinner"));
      display_result(sanitized_data, items, units, names);
      display($(".search-result"));
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

function display_result(sanitized_data, filters, units, names) {
  var appended = "";
  $(".result-titles").children("div").remove();
  for (var i = 0; i < names.length; i++) {
    $(".result-titles").append('<div class="col-md-1">' + names[i] + '</div>');
  }
  for (var i = 0; i < sanitized_data.length; i++) {
    var template = '<li class="list-group-item result-list-item"><div class="row result-row">';
    var data = sanitized_data[i];

    template = template + '<div class="col-md-1">' + (i + 1) + '</div>' +
      '<div class="col-md-1">' + data[0] + '</div>';
    for (var j = 0; j < filters.length; j++) {
      template = template + '<div class="col-md-1">' + 
        data_to_string(data, filters[j], units[j]) + '</div>';
    }
    template = template + '</div></li>'
    appended = appended + template;
  }
  $(".result-list-item").remove();
  $(".result-list").append(appended);
}

function data_to_string(data, filter, unit) {
  if (data[1][filter] == "na" || data[1][filter] == "nm") {
    return "-";
  }
  if (filter == "country" || filter == "stock_exchange" || filter == "name" || filter == "sector") {
    return data[1][filter];
  }
  if (unit == "USD(mn)" || unit == "mn") {
    return (data[1][filter] / 1000000).toFixed(2) + "M";
  }
  if (unit == "%") {
    return (data[1][filter] * 100).toFixed(2) + "%";
  }
  if (unit == "x") {
    return data[1][filter].toFixed(2) + "x";
  }
  return data[1][filter];
}