'use strict';
(function () {
  function sendTransfer(button) {
    return function () {
      var transfer = button.parentNode.childNodes;
      var obj = {
        user: transfer[0].childNodes[0].selectedOptions[0].value,
        accountNumber: button.parentNode.title,
      };
      if (obj.user !== '') {
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/admin/payment/add', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            button.parentNode.remove();
          }
        };
        xhr.send(JSON.stringify(obj));
      }
    };
  }

  var buttons = document.querySelectorAll('td:nth-child(6)');
  for (var i = 0; buttons.length; i++) {
    buttons[i].addEventListener('click', sendTransfer(buttons[i]), false);
  }
})();
