
function main() {
  const rippleElems = document.getElementsByClassName('ripple');
  for (let i = 0; i < rippleElems.length; i++) {
    let rippleElem = rippleElems[i];
    rippleElem.addEventListener('click', function (event) {
      spreadRipple(this, event);
    }, false);
  }
}
function spreadRipple(rippleElem, event) {
  const TIMEOUT = 512;
  const rippleWidth = rippleElem.offsetWidth;
  const rippleRect = rippleElem.getBoundingClientRect();
  const left = event.pageX - rippleRect.left - window.pageXOffset - (rippleWidth / 2);
  const top = event.pageY - rippleRect.top - window.pageYOffset - (rippleWidth / 2);
  const position = `
      left: ${left}px;
      top: ${top}px;
      width: ${rippleWidth}px;
      height: ${rippleWidth}px;
      `.trim();
  const spreadSpanElem = document.createElement('span');
  spreadSpanElem.setAttribute('style', position);
  spreadSpanElem.classList.add('spread');
  rippleElem.appendChild(spreadSpanElem);
  setTimeout(function () {
    spreadSpanElem.remove();
  }, TIMEOUT);
}
document.addEventListener('DOMContentLoaded', main);