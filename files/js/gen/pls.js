const collator = new Intl.Collator("kn", { sensitivity: "base" });
const dtFormat = new Intl.DateTimeFormat(document.querySelector("html").lang, { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit", second: "numeric" });
const downloadLink = document.getElementById("dnld");
var entriesNum = 0;
var fileContents = "[playlist]\n";
const help = document.getElementById("help");
const manuallyInput = document.getElementById("addNewOne");
const nameInput = document.getElementById("listName");
const fileInput = document.getElementById("fileInput");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const sorting = document.getElementById("sorting");
fileInput.addEventListener("change", handleFiles, true);
function handleFiles() {
  delFooter();
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
      if (sorting.value == 5) {
        return compareNum(a.size, b.size);
      }
      if (sorting.value == 6) {
        return compareNum(b.size, a.size);
      }
    });
  }
  const fileList = rawFileList;
  const numFiles = fileList.length;
  for (var i = 0; i < numFiles; i++) {
    var file = fileList[i];
    var rawDate = new Date(file.lastModified);
    var trackDate = dtFormat.format(rawDate);
    var trackName = file.name;
    var trackPath = trackName;
    var trackSize = file.size;
    var trNum = i + entriesNum + 1;
    if (prefixInput.value !== null) { trackPath = prefixInput.value + trackName; }
    if (sorting.value == 3 || sorting.value == 4) {
      playlist.innerHTML += `${trackDate} &#8212;&#160;`;
    }
    if (sorting.value == 5 || sorting.value == 6) {
      playlist.innerHTML += `${trackSize} ${playlist.getAttribute("data-size-type")} &#8212;&#160;`;
    }
    fileContents += `File${trNum}=${trackPath}\nTitle${trNum}=${trackName.slice(0, trackName.lastIndexOf("."))}\nLength${trNum}=-1\n`
    playlist.innerText += `${trackPath}\n`;
  }
  entriesNum = numFiles + entriesNum;
  showResult();
}
function showResult() {
  fileContents += `NumberOfEntries=${entriesNum}\nVersion=2`;
  const theBlob = new Blob([fileContents], {type: "text/plain"});
  if (nameInput.value !== "") {
    downloadLink.setAttribute("download", `${nameInput.value}.pls`);
    downloadLink.setAttribute("title", `${nameInput.value}.pls`);
  }
  downloadLink.href = URL.createObjectURL(theBlob);
  if (!playlist.classList.contains("show")) { playlist.classList.add("show"); }
  if (downloadLink.hasAttribute("hidden")) { downloadLink.removeAttribute("hidden"); }
}
function manuallyAdd() {
  delFooter();
  var miV = manuallyInput.value;
  var title = miV.slice(0, miV.lastIndexOf("."));
  var duration = -1;
  if (document.getElementById("addSeconds").value !== "") {
    var secField = document.getElementById("addSeconds");
    if (/(^-1$|^[1-9][\d]*$)/.test(secField.value)) {
      duration = secField.value;
    } else {
      document.querySelector("#wDuration").showModal();
      document.querySelector("body").classList.add("lockScroll");
      return;
    }
  }
  if (document.getElementById("addTitle").value !== "") {
    title = document.getElementById("addTitle").value;
  }
  if (miV !== "") {
    fileContents += `File${entriesNum + 1}=${miV}\nTitle${entriesNum + 1}=${title}\nLength${entriesNum + 1}=${duration}\n`;
    playlist.innerText += `${miV}\n`;
    manuallyInput.value = null;
    document.getElementById("addSeconds").value = -1;
    document.getElementById("addTitle").value = null;
    entriesNum++;
    showResult();
  }
}
function beforeGoingAFK() {
  localStorage.setItem("pls_sort", sorting.value);
  localStorage.setItem("pls_prefix", prefixInput.value);
  localStorage.setItem("pls_name", nameInput.value);
}
function loadSavedData() {
  let pls_sort = localStorage.getItem("pls_sort");
  let pls_prefix = localStorage.getItem("pls_prefix");
  let pls_name = localStorage.getItem("pls_name");
  if (pls_sort || pls_name || pls_prefix) {
    sorting.value = pls_sort;
    nameInput.value = pls_name;
    prefixInput.value = pls_prefix;
  }
}
function delFooter() {
  var tempFile = fileContents.replaceAll(/NumberOfEntries=[\d]*\nVersion=2/gm, "");
  fileContents = tempFile;
}
manuallyInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") { manuallyAdd(); }
});
document.addEventListener("DOMContentLoaded", loadSavedData);
document.addEventListener("visibilitychange", beforeGoingAFK);
document.getElementById("hOpen").onclick = function() {
  help.showModal();
  document.querySelector("body").classList.add("lockScroll");
}
document.getElementById("hClose").onclick = function() {
  help.close();
  document.querySelector("body").classList.remove("lockScroll");
}
document.getElementById("wClose").onclick = function() {
  document.querySelector("#wDuration").close();
  document.querySelector("body").classList.remove("lockScroll");
}
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() == "o" && e.ctrlKey) {
    e.preventDefault();
    fileInput.click();
  }
  if (e.key > -1 && e.key < 7 && e.ctrlKey) {
    e.preventDefault();
    sorting.value = e.key;
  }
  if (e.key.toLowerCase() == "s" && e.ctrlKey) {
    e.preventDefault();
    downloadLink.click();
  }
  if (e.key.toLowerCase() == "x" && e.ctrlKey) {
    e.preventDefault();
    document.getElementById("wClose").click();
  }
  if (e.key == "F1") {
    e.preventDefault();
    if (!help.open) {
      document.getElementById("hOpen").click();
    } else {
      document.getElementById("hClose").click();
    }
  }
});