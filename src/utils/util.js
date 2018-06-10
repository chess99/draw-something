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
