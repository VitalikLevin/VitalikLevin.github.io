const collator = new Intl.Collator("kn", { sensitivity: "base" });
const dtFormat = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit", second: "numeric", hour12: false });
const downloadLink = document.getElementById("dnld");
var listItems = [];
const force8 = document.getElementById("force8");
const help = document.getElementById("help");
const isExt = document.getElementById("isExt");
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
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    listItems.push({name: file.name, prefix: prefixInput.value, suffix: "", date: new Date(file.lastModified), size: file.size});
  }
  showResult();
}
function manuallyAdd() {
  if (manuallyInput.value !== null && manuallyInput.value !== "") {
    listItems.push({name: manuallyInput.value, prefix: "", suffix: "", date: 0, size: 0});
    showResult();
    manuallyInput.value = null;
  }
}
function createBtn(itsName, text, itsParent, itsClass=itsName.toLowerCase()) {
  let theBtn = document.createElement("button");
  theBtn.classList.add(itsClass);
  theBtn.title = itsName;
  theBtn.textContent = text;
  itsParent.appendChild(theBtn);
}
function showItems() {
  playlist.innerText = "";
  for (let fi = 0; fi < listItems.length; fi++) {
    const trackN = listItems[fi];
    let m3uItem = document.createElement("p");
    m3uItem.classList.add("listItem");
    m3uItem.textContent = `${trackN.prefix}${trackN.name}${trackN.suffix}`;
    playlist.appendChild(m3uItem);
    if (fi > 0) {
      createBtn("Up", "\ud83e\udc45", m3uItem);
    }
    createBtn("Delete", "\ud83d\uddd1", m3uItem, "del");
    if (fi < listItems.length - 1) {
      createBtn("Down", "\ud83e\udc47", m3uItem);
    }
  }
  for (let dels = 0; dels < document.querySelectorAll("button.del").length; dels++) {
    const elem = document.querySelectorAll("button.del")[dels];
    elem.onclick = function () {
      listItems.splice(dels, 1);
      showResult();
    }
  }
  for (let downs = 0; downs < document.querySelectorAll("button.down").length; downs++) {
    const elD = document.querySelectorAll("button.down")[downs];
    elD.onclick = function () {
      let tempItem = listItems[downs];
      listItems[downs] = listItems[downs + 1];
      listItems[downs + 1] = tempItem;
      showResult();
    }
  }
  for (let ups = 0; ups < document.querySelectorAll("button.up").length; ups++) {
    const elU = document.querySelectorAll("button.up")[ups];
    elU.onclick = function () {
      let tempItem = listItems[ups + 1];
      listItems[ups + 1] = listItems[ups];
      listItems[ups] = tempItem;
      showResult();
    }
  }
}
function showResult() {
  showItems();
  var tempContent = "";
  if (isExt.innerText == 1) {
    tempContent = "#EXTM3U\n"
  }
  for (let fil = 0; fil < listItems.length; fil++) {
    const track = listItems[fil];
    if (isExt.innerText == 1) {
      tempContent += `#EXTINF:-1,${track.name.slice(0, track.name.lastIndexOf("."))}\n`;
    }
    tempContent += `${track.prefix}${track.name}${track.suffix}\n`;
  }
  tempContent = tempContent.slice(0, tempContent.lastIndexOf("\n"));
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
  if (isExt.innerText == 1) {
    localStorage.setItem("extendM3U", 1);
  } else {
    localStorage.setItem("extendM3U", 0);
  }
}
function loadSavedData() {
  let cacheExtend = localStorage.getItem("extendM3U");
  let cacheForce8 = localStorage.getItem("force8");
  let listName = localStorage.getItem("listName");
  let prefix = localStorage.getItem("prefix");
  let sortMethod = localStorage.getItem("sortMethod");
  if (cacheForce8 || cacheExtend || listName || prefix || sortMethod) {
    force8.innerText = cacheForce8;
    isExt.innerText = cacheExtend;
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