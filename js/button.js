(function() {
  'use strict';
  (function() {
    var ripples = document.getElementsByClassName('ripple');
    if (ripples) {
      for (var i = 0; i < ripples.length; i++) {
        var ripple = ripples[i];
        ripple.addEventListener('click', function(event) {
          spreadRipple(this, event);
        }, false);
      }
    }
    function spreadRipple(ripple, event) {
      var TIMEOUT = 512;
      var rippleWidth = ripple.offsetWidth;
      var rippleRect = ripple.getBoundingClientRect();
      var left = event.pageX - rippleRect.left - window.pageXOffset - (rippleWidth / 2);
      var top = event.pageY - rippleRect.top - window.pageYOffset - (rippleWidth / 2);
      var position = '';
      position += 'left:' + left + 'px;';
      position += 'top:' + top + 'px;';
      position += 'width:' + rippleWidth + 'px;';
      position += 'height:' + rippleWidth + 'px;';
      var spread = document.createElement('span');
      spread.setAttribute('style', position);
      spread.classList.add('spread');
      ripple.appendChild(spread);
      setTimeout(function() {
        var spreads = document.getElementsByClassName('spread');
        for (var i = spreads.length - 1; 0 <= i; i--) {
          spreads[i].parentElement.lastElementChild.remove();
        }
      }, TIMEOUT);
    }
  })();
})();