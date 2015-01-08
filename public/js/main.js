'use strict';
(function () {
  var dates = document.querySelectorAll('td:nth-child(11)');
  var i;
  var d;
  var currentDate = new Date();
  for (i=0; i<dates.length; i++) {
    if (dates[i].innerText !== '') {
      d = new Date(dates[i].innerText);
      dates[i].innerText = d.getFullYear() + '/' + parseInt(d.getMonth()+1) +
      '/' + d.getDate();
      if (d > currentDate) {
        dates[i].parentNode.style.color = 'green';
      } else {
        dates[i].parentNode.style.color = 'red';
      }
    }
  }
})();
