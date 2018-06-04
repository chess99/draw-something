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

export function saveAsPNG(fileName, img) {
  var aLink = document.createElement("a");
  aLink.download = fileName;
  aLink.href = img;
  aLink.innerText = "save";

  var evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true
  });
  aLink.dispatchEvent(evt);
}
