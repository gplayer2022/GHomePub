(function() {
  'use strict';
  window.addEventListener('scroll', function() {
    var stickyHeader = document.getElementById('sticky-header');
    var offsetTop = stickyHeader.offsetTop;
    if (offsetTop < window.pageYOffset) {
      stickyHeader.classList.add('sticky');
    } else {
      stickyHeader.classList.remove('sticky');
    }
  });
})();