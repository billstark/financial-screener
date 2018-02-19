$(document).ready(function() {
  setupCountries();
  setupSectors();
  append_numerical_filter($(".filter-list"), "evtorevenue", "Enterprise Value to Revenue (EV/Rev)");
  append_numerical_filter($(".filter-list"), "evtorevenue", "Enterprise Value to Revenue (EV/Rev)");
  setup_fundamental_filter_tags();
  setup_share_info_filter_tags();
  setup_valuation_filter_tags();
});


function setup_fundamental_filter_tags() {
  for (var i = 0; i < fundamental_filter_tags.length; i++) {
    var template = '<div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary" filer-tag="' + fundamental_filter_tags[i][1] + 
    '">' + fundamental_filter_tags[i][0] + '</button>' + '</div>';

    $(".fundamental").find(".row").append(template);
  }
}

function setup_share_info_filter_tags() {
  for (var i = 0; i < share_filter_tags.length; i++) {
    var template = '<div class="row"><div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary" filer-tag="' + share_filter_tags[i][1] + 
    '">' + share_filter_tags[i][0] + '</button>' + '</div></div>';

    $(".share-info").append(template);
  }
}

function setup_valuation_filter_tags() {
  for (var i = 0; i < valuation_filter_tags.length; i++) {
    var template = '<div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary" filer-tag="' + valuation_filter_tags[i][1] + 
    '">' + valuation_filter_tags[i][0] + '</button>' + '</div>';

    $(".valuation").find(".row").append(template);
  }
}

function setupCountries() {
  for (var i = 0; i < countries.length; i++) {
    $(".country-section").find(".countries").append("<option value='" + i + "'>" + countries[i] + "</option>")
  }
}

function setupSectors() {
  for (var i = 0; i < sectors.length; i++) {
    $(".sector-section").find(".sectors").append("<option value='" + i + "'>" + sectors[i] + "</option>")
  }
}