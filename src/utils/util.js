export function isTouchDevice() {
  return "createTouch" in document;
}

export function getOffset(element) {
  let offset = {
    top: element.offsetTop,
    left: element.offsetLeft
  };

  let parentElement = element.offsetParent;
  while (parentElement) {
    offset.top += element.offsetParent.offsetTop;
    offset.left += element.offsetParent.offsetLeft;
    parentElement = parentElement.offsetParent;
  }

  return offset;
}
