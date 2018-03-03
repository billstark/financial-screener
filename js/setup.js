$(document).ready(function() {
  setupCountries();
  setupSectors();
  setup_fundamental_filter_tags();
  setup_share_info_filter_tags();
  setup_valuation_filter_tags();
});

var selected_tags = [];

function setup_fundamental_filter_tags() {
  for (var i = 0; i < fundamental_filter_tags.length; i++) {
    var template = '<div class="col-md-6">' + 
    '<button type="button" class="btn btn-primary ' + fundamental_filter_tags[i][1] + 
    '" filter-tag="' + fundamental_filter_tags[i][1] + 
    '" filter-unit="' + fundamental_filter_tags[i][2] +
    '">' + fundamental_filter_tags[i][0] + '</button>' + '</div>';

    $(".fundamental").find(".row").append(template);
    $(".fundamental ." + fundamental_filter_tags[i][1]).click(function() {
      append_ordering($(this).attr("filter-tag"));
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-success")
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
        append_ordering($(this).attr("filter-tag"));
        append_selection_filter($(".filter-list"), $(this).attr("filter-tag"), $(this).text());
        $(".alert-success")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
      });
      continue;
    }
    $(".share-info ." + share_filter_tags[i][1]).click(function() {
      append_ordering($(this).attr("filter-tag"));
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-success")
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
      append_ordering($(this).attr("filter-tag"));
      append_numerical_filter($(".filter-list"), 
        $(this).attr("filter-tag"), $(this).text(), 
        $(this).attr("filter-unit"));
      $(".alert-success")
          .removeClass("hidden")
          .html("<strong>Success!</strong> You have successfully added filter <strong>" + $(this).text() + "</strong>");
    });
  }
}

function remove_ordering(tag) {
  var counter = 0;
  var filter_list_items = $(".filter-list-item");
  for (var i = 0; i < filter_list_items.length; i++) {
    if ($(filter_list_items[i]).attr("filter-tag") == tag) {
      counter++;
    }
  }
  if (counter >= 1) { return; }
  var filter_selection = $(".filter-order");
  selected_tags = selected_tags.filter(function(x) { return x != tag; });
  filter_selection.children(".appended").remove();
  for (var i = 0; i < selected_tags.length; i++) {
    filter_selection.append('<option class="appended" value="' + selected_tags[i] + '">' + tag_mapping[selected_tags[i]] + '</option>');
  }
}

function append_ordering(tag) {
  var filter_selection = $(".filter-order");
  if (selected_tags.indexOf(tag) != -1) {
    return;
  }
  selected_tags.push(tag);
  filter_selection.children(".appended").remove();
  for (var i = 0; i < selected_tags.length; i++) {
    filter_selection.append('<option class="appended" value="' + selected_tags[i] + '">' + tag_mapping[selected_tags[i]] + '</option>');
  }
}