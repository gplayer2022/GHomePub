window.addEventListener('scroll', function() {
  const stickyHeaderElem = document.getElementById('sticky-header');
  const offsetTop = stickyHeaderElem.offsetTop;
  if (offsetTop < window.pageYOffset) {
    stickyHeaderElem.classList.add('sticky');
  } else {
    stickyHeaderElem.classList.remove('sticky');
  }
});
