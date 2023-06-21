const downloadLink = document.getElementById("dnld");
var fileContents = "#EXTM3U\n";
const inputElement = document.getElementById("input");
var inputTextValue;
const playlist = document.getElementById("playlist");
inputElement.addEventListener("change", handleFiles, true);
function handleFiles() {
  const fileList = this.files;
  const numFiles = fileList.length;
  for (var i = 0; i < numFiles; i++) {
    var file = fileList[i];
    var trackName = file.name;
    if (inputTextValue != null) { trackName = inputTextValue + file.name; }
    playlist.innerHTML += trackName + "<br>";
    fileContents += trackName + "\n";
  }
  const theBlob = new Blob([fileContents], {type: "text/plain"});
  downloadLink.href = URL.createObjectURL(theBlob);
  playlist.classList.add("show");
}
window.onkeyup = keyup;
function keyup(e) { inputTextValue = e.target.value; }