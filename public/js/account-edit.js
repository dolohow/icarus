(function () {
  var dates = document.querySelectorAll('.payments td:nth-child(1)');
  for (i = 0; i < dates.length; i++) {
    dates[i].innerText = new Date(dates[i].innerText).toLocaleDateString();
  }
})();
