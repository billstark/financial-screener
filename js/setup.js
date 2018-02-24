$(document).ready(function() {
  setupCountries();
  setupSectors();
  setup_fundamental_filter_tags();
  setup_share_info_filter_tags();
  setup_valuation_filter_tags();
});


function setup_fundamental_filter_tags() {
  for (var i = 0; i < fundamental_filter_tags.length; i++) {
    var template = '<div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary ' + fundamental_filter_tags[i][1] + 
    '" filter-tag="' + fundamental_filter_tags[i][1] + 
    '" filter-unit="' + fundamental_filter_tags[i][2] +
    '">' + fundamental_filter_tags[i][0] + '</button>' + '</div>';

    $(".fundamental").find(".row").append(template);
    $(".fundamental ." + fundamental_filter_tags[i][1]).click(function() {
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-info")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
    });
  }
}

function setup_share_info_filter_tags() {
  for (var i = 0; i < share_filter_tags.length; i++) {
    var template = '<div class="row"><div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary ' + share_filter_tags[i][1] + 
    '" filter-tag="' + share_filter_tags[i][1] + 
    '" filter-unit="' + share_filter_tags[i][2] +
    '">' + share_filter_tags[i][0] + '</button>' + '</div></div>';

    $(".share-info").append(template);
    if (share_filter_tags[i][0] == "Exchange" || 
      share_filter_tags[i][0] == "Country" || 
      share_filter_tags[i][0] == "Sector") {
      $(".share-info ." + share_filter_tags[i][1]).click(function() {
        append_selection_filter($(".filter-list"), $(this).attr("filter-tag"), $(this).text());
        $(".alert-info")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
      });
      continue;
    }
    $(".share-info ." + share_filter_tags[i][1]).click(function() {
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-info")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
    });
  }
}

function setup_valuation_filter_tags() {
  for (var i = 0; i < valuation_filter_tags.length; i++) {
    var template = '<div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary ' + valuation_filter_tags[i][1] + 
    '" filter-tag="' + valuation_filter_tags[i][1] + 
    '" filter-unit="' + valuation_filter_tags[i][2] +
    '">' + valuation_filter_tags[i][0] + '</button>' + '</div>';

    $(".valuation").find(".row").append(template);
    $(".valuation ." + valuation_filter_tags[i][1]).click(function() {
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-info")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
    });
  }
}