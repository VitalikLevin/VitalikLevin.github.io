const collator = new Intl.Collator("kn", { sensitivity: "base" });
const dtFormat = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit", second: "numeric", hour12: false });
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
  for (let i = 0; i < numFiles; i++) {
    const file = fileList[i];
    const rawDate = new Date(file.lastModified);
    const trackDate = dtFormat.format(rawDate);
    const trackName = file.name;
    const trackSize = file.size;
    if (prefixInput.value !== null) { trackName = prefixInput.value + file.name; }
    if (sorting.value == 3 || sorting.value == 4) {
      playlist.innerHTML += `${trackDate} &#8212;&#160;`;
    }
    if (sorting.value == 5 || sorting.value == 6) {
      playlist.innerHTML += `${trackSize} ${playlist.getAttribute("data-size-type")} &#8212;&#160;`;
    }
    fileContents += `${trackName}\n`;
    playlist.innerText += `${trackName}\n`;
  }
  showResult();
}
function manuallyAdd() {
  if (manuallyInput.value !== null && manuallyInput.value !== "") {
    fileContents += `${manuallyInput.value}\n`;
    playlist.innerText += `${manuallyInput.value}\n`;
    showResult();
    manuallyInput.value = null;
  }
}
function showResult() {
  const tempContent = fileContents.slice(0, fileContents.lastIndexOf("\n"));
  var theBlob = new Blob([tempContent], {type: "audio/mpegurl"});
  const isLatin = (force8.innerText == 1 || /[^\u0000-\u00ff]+/g.test(tempContent));
  if (nameInput.value !== "") {
    if (isLatin) {
      downloadLink.setAttribute("download", `${nameInput.value}.m3u8`);
      downloadLink.setAttribute("title", `${nameInput.value}.m3u8`);
      theBlob = new Blob([tempContent], {type: "application/vnd.apple.mpegurl"});
    } else {
      downloadLink.setAttribute("download", `${nameInput.value}.m3u`);
      downloadLink.setAttribute("title", `${nameInput.value}.m3u`);
    }
  } else if (isLatin) {
    downloadLink.setAttribute("download", "playlist.m3u8");
    downloadLink.setAttribute("title", "playlist.m3u8");
    theBlob = new Blob([tempContent], {type: "application/vnd.apple.mpegurl"});
  }
  downloadLink.href = URL.createObjectURL(theBlob);
  if (downloadLink.hasAttribute("hidden")) { downloadLink.removeAttribute("hidden"); }
  if (document.body.style.cursor != "auto") { document.body.style.cursor = "auto"; }
}
function beforeGoingAFK() {
  localStorage.setItem("sortMethod", sorting.value);
  localStorage.setItem("prefix", prefixInput.value);
  localStorage.setItem("listName", nameInput.value);
  if (force8.innerText == 1) {
    localStorage.setItem("force8", 1);
  } else {
    localStorage.setItem("force8", 0);
  }
}
function loadSavedData() {
  let cacheForce8 = localStorage.getItem("force8");
  let listName = localStorage.getItem("listName");
  let prefix = localStorage.getItem("prefix");
  let sortMethod = localStorage.getItem("sortMethod");
  if (cacheForce8 || listName || prefix || sortMethod) {
    force8.innerText = cacheForce8;
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
  if (e.key.toLowerCase() == "k" && e.ctrlKey && e.key.toLowerCase() == "m") {
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