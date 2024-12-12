const collator = new Intl.Collator("kn", { sensitivity: "base" });
const downloadLink = document.getElementById("dnld");
var listItems = [];
const force8 = document.getElementById("force8");
const help = document.getElementById("help");
const isExt = document.getElementById("isExt");
const manuallyInput = document.getElementById("addNewOne");
const nameInput = document.getElementById("listName");
const inputElement = document.getElementById("input");
const importer = document.getElementById("importM3U");
const editDial = document.getElementById("eItem");
const prefixInput = document.getElementById("prefixInput");
const playlist = document.getElementById("playlist");
const sorting = document.getElementById("sorting");
inputElement.addEventListener("change", handleFiles, true);
importer.addEventListener("change", importList, false);
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
    listItems.push({name: file.name, prefix: prefixInput.value, suffix: "", date: new Date(file.lastModified), size: file.size, extinf: ""});
  }
  showResult();
}
function importList() {
  document.body.style.cursor = "wait";
  var thePlaylist = [...this.files].at(0);
  const reader = new FileReader();
  reader.addEventListener("load", function() {
    if (validFileType(thePlaylist) == false) {
      return;
    }
    const readRes = reader.result.replaceAll("\r\n", "\n");
    for (let strN = 0; strN < readRes.split("\n").length; strN++) {
      let extendInf = "";
      if (readRes.split("\n")[0] == "#EXTM3U" && /^(#EXTINF:)+/gi.test(readRes.split("\n")[strN - 1]) == true) {
        extendInf = readRes.split("\n")[strN - 1].replace("#EXTINF:", "");
      }
      const tempStr = readRes.split("\n")[strN];
      if (tempStr != "#EXTM3U" && /^(#EXTINF:)+/gi.test(tempStr) == false && tempStr == "") {
        listItems.push({name: tempStr, prefix: "", suffix: "", date: 0, size: 0, extinf: extendInf});
      }
    }
    showResult();
  }, false);
  reader.readAsText(thePlaylist);
}
function validFileType(theFile) {
  const fileTypes = ["audio/mpegurl", "application/vnd.apple.mpegurl", "audio/x-mpegurl", ""];
  for (let w = 0; w < fileTypes.length; w++) {
    if (theFile.type === fileTypes[w]) {
      document.getElementById("wClose").click();
      return true;
    }
  }
  document.getElementById("wFile").show();
  return false;
}
function editorClose() {
  listItems[editDial.getAttribute("data-item-n")].extinf = `-1,${document.getElementById("changeName").value}`;
  editDial.close();
  showResult();
}
function manuallyAdd() {
  if (manuallyInput.value !== null && manuallyInput.value !== "") {
    listItems.push({name: manuallyInput.value, prefix: "", suffix: "", date: 0, size: 0, extinf: ""});
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
    createBtn("Edit", "\ud83d\udd89", m3uItem, "edit");
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
  for (let edits = 0; edits < document.querySelectorAll("button.edit").length; edits++) {
    const elE = document.querySelectorAll("button.edit")[edits];
    elE.onclick = function () {
      let startAt = Math.max(listItems[edits].name.lastIndexOf("/"), listItems[edits].name.lastIndexOf("\\"));
      let endAt = listItems[edits].name.lastIndexOf(".");
      editDial.setAttribute("data-item-n", edits);
      if (listItems[edits].extinf != "") {
        document.getElementById("changeName").value = `${listItems[edits].extinf.slice(listItems[edits].extinf.indexOf(",") + 1)}`;
      } else {
        if (endAt <= 0) {
          document.getElementById("changeName").value = `${listItems[edits].name.slice(startAt + 1)}`;
        } else {
          document.getElementById("changeName").value = `${listItems[edits].name.slice(startAt + 1, endAt)}`;
        }
      }
      document.querySelector("html").classList.add("lockScroll");
      editDial.showModal();
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
  if (listItems.length == 0) {
    downloadLink.setAttribute("hidden", "");
    return;
  }
  var tempContent = "";
  if (isExt.innerText == 1) {
    tempContent = "#EXTM3U\n";
  }
  for (let fil = 0; fil < listItems.length; fil++) {
    const track = listItems[fil];
    if (isExt.innerText == 1) {
      if (track.extinf != "") {
        tempContent += `#EXTINF:${track.extinf}\n`;
      } else {
        let startChar = Math.max(track.name.lastIndexOf("/"), track.name.lastIndexOf("\\"));
        tempContent += `#EXTINF:-1,${track.name.slice(startChar + 1, track.name.lastIndexOf("."))}\n`;
      }
    }
    tempContent += `${track.prefix}${track.name}${track.suffix}\n`;
  }
  tempContent = tempContent.slice(0, tempContent.lastIndexOf("\n"));
  var theBlob = new Blob([tempContent], {type: "audio/mpegurl"});
  const notLatin = (force8.innerText == 1 || /[^\u0000-\u00ff]+/g.test(tempContent));
  if (nameInput.value !== "") {
    if (notLatin) {
      downloadLink.setAttribute("download", `${nameInput.value}.m3u8`);
      downloadLink.setAttribute("title", `${nameInput.value}.m3u8`);
      theBlob = new Blob([tempContent], {type: "application/vnd.apple.mpegurl"});
    } else {
      downloadLink.setAttribute("download", `${nameInput.value}.m3u`);
      downloadLink.setAttribute("title", `${nameInput.value}.m3u`);
    }
  } else if (notLatin) {
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
document.getElementById("changeName").addEventListener("keydown", function(ev) {
  if (ev.key == "Enter") { editorClose(); }
});
document.getElementById("eClose").onclick = editorClose;
document.getElementById("hOpen").onclick = function() {
  help.showModal();
  document.querySelector("html").classList.add("lockScroll");
}
document.getElementById("hClose").onclick = function() {
  help.close();
}
document.getElementById("wClose").onclick = function() {
  document.querySelector("#wFile").close();
}
document.addEventListener("visibilitychange", beforeGoingAFK);
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() == "o" && e.ctrlKey) {
    e.preventDefault();
    importer.click();
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