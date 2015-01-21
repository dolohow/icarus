'use strict';
(function () {
  function performValidation(e) {
    var username = document.querySelector('span').innerText;
    var field = document.querySelector('input[name=username]').value;
    if (username !== field) {
      e.preventDefault();
    }
  }
  var submit = document.querySelector('input[type=submit]');
  submit.addEventListener('click', performValidation, false);
})();
