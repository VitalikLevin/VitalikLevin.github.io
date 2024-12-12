const collator = new Intl.Collator("kn", { sensitivity: "base" });
const dtFormat = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit", second: "numeric", hour12: false });
const downloadLink = document.getElementById("dnld");
var entriesNum = 0;
var fileContents = "[playlist]\n";
const fileInput = document.getElementById("fileInput");
const help = document.getElementById("help");
const manuallyInput = document.getElementById("addNewOne");
const nameInput = document.getElementById("listName");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const props = document.getElementById("trProperties");
const sorting = document.getElementById("sorting");
fileInput.addEventListener("change", handleFiles);
function handleFiles() {
  delFooter();
  document.body.style.cursor = "wait";
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
    const file = fileList[i];
    const rawDate = new Date(file.lastModified);
    const trackDate = dtFormat.format(rawDate);
    var trackDur = -1;
    const trackName = file.name;
    var trackPath = trackName;
    const trackSize = file.size;
    var trNum = i + entriesNum + 1;
    if (prefixInput.value !== null) { trackPath = prefixInput.value + trackName; }
    if (sorting.value == 3 || sorting.value == 4) {
      playlist.innerHTML += `${trackDate} &#8212;&#160;`;
    }
    if (sorting.value == 5 || sorting.value == 6) {
      playlist.innerHTML += `${trackSize} ${playlist.getAttribute("data-size-type")} &#8212;&#160;`;
    }
    fileContents += `File${trNum}=${trackPath}\n`;
    if (props.value <= 1) {
      fileContents += `Title${trNum}=${trackName.slice(0, trackName.lastIndexOf("."))}\n`;
    }
    if (props.value % 2 == 0) {
      fileContents += `Length${trNum}=${trackDur}\n`;
    }
    playlist.innerText += `${trackPath}\n`;
  }
  entriesNum = numFiles + entriesNum;
  showResult();
}
function showResult() {
  fileContents += `NumberOfEntries=${entriesNum}\nVersion=2`;
  const theBlob = new Blob([fileContents], {type: "audio/x-scpls"});
  if (nameInput.value !== "") {
    downloadLink.setAttribute("download", `${nameInput.value}.pls`);
    downloadLink.setAttribute("title", `${nameInput.value}.pls`);
  }
  downloadLink.href = URL.createObjectURL(theBlob);
  if (downloadLink.hasAttribute("hidden")) { downloadLink.removeAttribute("hidden"); }
  if (document.body.style.cursor != "auto") { document.body.style.cursor = "auto"; }
}
function manuallyAdd() {
  delFooter();
  var miV = manuallyInput.value;
  var title = miV.slice(0, miV.lastIndexOf("."));
  var duration = -1;
  if (document.getElementById("addSeconds").value !== "" && props.value % 2 == 0) {
    var secField = document.getElementById("addSeconds");
    if (secField.value.match(/(^-1$|^[1-9][\d]*$)/)) {
      duration = secField.value;
      document.querySelector("#wClose").click();
    } else {
      document.querySelector("#wDuration").show();
      return;
    }
  }
  if (document.getElementById("addTitle").value !== "" && props.value <= 1) {
    title = document.getElementById("addTitle").value;
  }
  if (miV !== "") {
    fileContents += `File${entriesNum + 1}=${miV}\n`;
    if (props.value <= 1) {
      fileContents += `Title${entriesNum + 1}=${title}\n`;
      document.getElementById("addTitle").value = null;
    }
    if (props.value % 2 == 0) {
      fileContents += `Length${entriesNum + 1}=${duration}\n`;
      document.getElementById("addSeconds").value = -1;
    }
    playlist.innerText += `${miV}\n`;
    manuallyInput.value = null;
    entriesNum++;
    showResult();
  }
}
function beforeGoingAFK() {
  localStorage.setItem("sortMethod", sorting.value);
  localStorage.setItem("pls_props", props.value);
  localStorage.setItem("prefix", prefixInput.value);
  localStorage.setItem("listName", nameInput.value);
}
function loadSavedData() {
  let sortMethod = localStorage.getItem("sortMethod");
  let prefix = localStorage.getItem("prefix");
  let listName = localStorage.getItem("listName");
  let pls_props = localStorage.getItem("pls_props");
  if (sortMethod || listName || prefix || pls_props) {
    sorting.value = sortMethod;
    props.value = pls_props;
    nameInput.value = listName;
    prefixInput.value = prefix;
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
  document.querySelector("html").classList.add("lockScroll");
}
document.getElementById("hClose").onclick = function() {
  help.close();
}
document.getElementById("wClose").onclick = function() {
  document.querySelector("#wDuration").close();
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
  if (e.key == "F1") {
    e.preventDefault();
    if (!help.open) {
      document.getElementById("hOpen").click();
    } else {
      document.getElementById("hClose").click();
    }
  }
});