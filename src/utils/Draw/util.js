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

export function evtPointInPage(evt) {
  let item = isTouchDevice() ? evt.touches[0] : evt
  const x = item.pageX;
  const y = item.pageY;
  return { x, y }
}

export function evtPointInCanvas(evt, canvasEle) {
  let _canX = getOffset(canvasEle).left;
  let _canY = getOffset(canvasEle).top;

  let p = evtPointInPage(evt);
  let x = p.x - _canX;
  let y = p.y - _canY;
  return { x, y }
}
