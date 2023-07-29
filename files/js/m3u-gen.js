const collator = new Intl.Collator("kn", { sensitivity: "base" });
const dtFormat = new Intl.DateTimeFormat(document.querySelector("html").lang, { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit", second: "numeric" });
const downloadLink = document.getElementById("dnld");
var fileContents = "";
const force8 = document.getElementById("force8");
const help = document.getElementById("help");
const manuallyInput = document.getElementById("addNewOne");
const nameInput = document.getElementById("listName");
const inputElement = document.getElementById("input");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const sorting = document.getElementById("sorting");
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
    var trackSize = file.size;
    if (prefixInput.value !== null) { trackName = prefixInput.value + file.name; }
    if (sorting.value == 3 || sorting.value == 4) {
      playlist.innerHTML += trackDate + " &#8212; ";
    }
    if (sorting.value == 5 || sorting.value == 6) {
      playlist.innerHTML += trackSize + " " + playlist.getAttribute("data-size-type") + " &#8212; ";
    }
    fileContents += trackName + "\n";
    playlist.innerText += trackName;
    playlist.innerHTML += "<br>";
  }
  showResult();
}
function compareNum(a, b) { return a - b; }
function manuallyAdd() {
  if (manuallyInput.value !== null && manuallyInput.value !== "") {
    fileContents += manuallyInput.value + "\n";
    playlist.innerText += manuallyInput.value;
    playlist.innerHTML += "<br>";
    showResult();
    manuallyInput.value = null;
  }
}
function showResult() {
  const theBlob = new Blob([fileContents], {type: "text/plain"});
  if (nameInput.value !== "") {
    if (force8.checked) {
      downloadLink.setAttribute("download", nameInput.value + ".m3u8");
      downloadLink.setAttribute("title", nameInput.value + ".m3u8");
    } else {
      downloadLink.setAttribute("download", nameInput.value + ".m3u");
      downloadLink.setAttribute("title", nameInput.value + ".m3u");
    }
  } else if (force8.checked) {
    downloadLink.setAttribute("download", "playlist.m3u8");
    downloadLink.setAttribute("title", "playlist.m3u8");
  }
  downloadLink.href = URL.createObjectURL(theBlob);
  if (!playlist.classList.contains("show")) { playlist.classList.add("show"); }
  if (downloadLink.hasAttribute("hidden")) { downloadLink.removeAttribute("hidden"); }
}
function beforeGoingAFK() {
  localStorage.setItem("sortMethod", sorting.value);
  if (prefixInput.value !== null) { localStorage.setItem("prefix", prefixInput.value); }
  if (nameInput.value !== null) { localStorage.setItem("listName", nameInput.value); }
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
document.addEventListener("DOMContentLoaded", loadSavedData());
manuallyInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") { manuallyAdd(); }
});
document.getElementById("hOpen").onclick = function() {
  help.showModal();
  document.querySelector("body").classList.add("lockScroll");
}
document.getElementById("hClose").onclick = function() {
  help.close();
  document.querySelector("body").classList.remove("lockScroll");
}
document.addEventListener("visibilitychange", beforeGoingAFK);
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() == "o" && e.ctrlKey) {
    e.preventDefault();
    inputElement.click();
  }
  if (e.key > -1 && e.key < 7 && e.ctrlKey) {
    e.preventDefault();
    sorting.value = e.key;
  }
  if (e.key.toLowerCase() == "c" && e.altKey) {
    e.preventDefault();
    force8.click();
  }
  if (e.key.toLowerCase() == "s" && e.ctrlKey) {
    e.preventDefault();
    downloadLink.click();
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