$(document).ready(function() {
  setupCountries();
  setupSectors();
});

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