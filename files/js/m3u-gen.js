const collator = new Intl.Collator("kn", { sensitivity: "base" });
const downloadLink = document.getElementById("dnld");
var fileContents = "#EXTM3U\n";
const nameInput = document.getElementById("listName");
const inputElement = document.getElementById("input");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const sorting = document.getElementById("sorting");
inputElement.addEventListener("change", handleFiles, true);
function handleFiles() {
  const rawFileList = [...this.files];
  if (sorting.value == 1) {
    rawFileList.sort((a, b) => {
      return collator.compare(a.name, b.name);
    });
  }
  if (sorting.value == 2) {
    rawFileList.sort((a, b) => {
      return compareNum(a.lastModified, b.lastModified);
    });
  }
  const fileList = rawFileList;
  const numFiles = fileList.length;
  for (var i = 0; i < numFiles; i++) {
    var file = fileList[i];
    var trackName = file.name;
    if (prefixInput.value != null) { trackName = prefixInput.value + file.name; }
    playlist.innerHTML += trackName + "<br>";
    fileContents += trackName + "\n";
  }
  const theBlob = new Blob([fileContents], {type: "text/plain"});
  if (nameInput.value != null) { downloadLink.setAttribute("download", nameInput.value + ".m3u"); }
  downloadLink.href = URL.createObjectURL(theBlob);
  playlist.classList.add("show");
}
function flush(textInput) { textInput.value = null; }
function compareNum(a, b) {
  return a - b;
}