'use strict';

(function () {
  function getDiskUsage() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', window.location.href + '/disk', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var p = document.createElement('p');
        p.textContent += 'Disk usage: ';
        p.textContent +=
          parseFloat(JSON.parse(xhr.responseText).disk / 1024 / 1024)
            .toFixed(2);
        p.textContent += ' GB';
        document.body.appendChild(p);
      }
    };
    xhr.send();
  }

  getDiskUsage();
})();
