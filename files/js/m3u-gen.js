const collator = new Intl.Collator("kn", { sensitivity: "base" });
const downloadLink = document.getElementById("dnld");
var fileContents = "";
const manuallyInput = document.getElementById("addNewOne");
const nameInput = document.getElementById("listName");
const inputElement = document.getElementById("input");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const sorting = document.getElementById("sorting");
window.onload = loadSavedData;
inputElement.addEventListener("change", handleFiles, true);
function handleFiles() {
  const rawFileList = [...this.files];
  if (sorting.value != 0) {
    rawFileList.sort((a, b) => {
      if (sorting.value == 1) {
        return collator.compare(a.name, b.name);
      }
      if (sorting.value == 2) {
        return collator.compare(b.name, a.name);
      }
      if (sorting.value == 3) {
        return compareNum(a.lastModified, b.lastModified);
      }
      if (sorting.value == 4) {
        return compareNum(b.lastModified, a.lastModified);
      }
    });
  }
  const fileList = rawFileList;
  const numFiles = fileList.length;
  for (var i = 0; i < numFiles; i++) {
    var file = fileList[i];
    var rawTrD = new Date(file.lastModified);
    var trackDate = rawTrD.getFullYear() + "-" + (rawTrD.getMonth() + 1) + "-" + rawTrD.getDate() + " " + rawTrD.getHours() + ":" + rawTrD.getMinutes() + ":" + rawTrD.getSeconds();
    var trackName = file.name;
    if (prefixInput.value !== null) { trackName = prefixInput.value + file.name; }
    if (sorting.value == 3 || sorting.value == 4) {
      playlist.innerHTML += trackDate + " &#8212; " + trackName + "<br>";
    } else {
      playlist.innerHTML += trackName + "<br>";
    }
    fileContents += trackName + "\n";
  }
  showResult();
}
function compareNum(a, b) { return a - b; }
function manuallyAdd() {
  if (manuallyInput.value !== null && manuallyInput.value !== "") {
    playlist.innerHTML += manuallyInput.value + "<br>";
    fileContents += manuallyInput.value + "\n";
    showResult();
    manuallyInput.value = null;
  }
}
function showResult() {
  const theBlob = new Blob([fileContents], {type: "text/plain"});
  if (nameInput.value !== null) { downloadLink.setAttribute("download", nameInput.value + ".m3u"); }
  downloadLink.href = URL.createObjectURL(theBlob);
  if (!playlist.classList.contains("show")) { playlist.classList.add("show"); }
}
function beforeGoingAFK() {
  localStorage.setItem("sortMethod", sorting.value);
  if (prefixInput.value !== null && prefixInput.value !== "") { localStorage.setItem("prefix", prefixInput.value); }
  if (nameInput.value !== null && nameInput.value !== "") { localStorage.setItem("listName", nameInput.value); }
}
function loadSavedData() {
  let listName = localStorage.getItem("listName");
  let prefix = localStorage.getItem("prefix");
  let sortMethod = localStorage.getItem("sortMethod");
  if (listName || prefix || sortMethod) {
    nameInput.value = listName;
    prefixInput.value = prefix;
    sorting.value = sortMethod;
  }
}
window.onkeydown = function(e){
  const key = e.key;
  if (key == "Enter") { manuallyAdd(); }
};
window.addEventListener("visibilitychange", beforeGoingAFK, true);