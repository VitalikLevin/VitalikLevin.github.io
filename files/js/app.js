let darkMode = document.getElementById('darkMode');
function compareNum(a, b) { return a - b; }
function binButton() {
  let binArr = document.querySelectorAll('button.bin');
  for (let a = 0; a < binArr.length; a++) {
    const button = binArr[a];
    button.onclick = function() {
      if (button.innerText != '1') {
        button.innerText = '1';
      } else {
        button.innerText = '0';
      }
    }
  }
}
function changeTheme() {
  if (Number(darkMode.innerText) != 1) {
    let tempD = document.querySelector('link[href="/files/css/dark.css"]');
    if (tempD) { tempD.setAttribute('href', '/files/css/light.css'); }
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f4f4f4');
  } else {
    let tempL = document.querySelector('link[href="/files/css/light.css"]');
    if (tempL) { tempL.setAttribute('href', '/files/css/dark.css'); }
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#000000');
  }
  localStorage.setItem('isDark', darkMode.innerText);
}
function onLoadTheme() {
  let isDark = localStorage.getItem('isDark');
  if (isDark == '' || isDark == undefined) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches || window.location.search.match(/isdark=(1|y)/i)) {
      darkMode.innerText = '1';
    } else {
      darkMode.innerText = '0';
    }
  } else {
    darkMode.innerText = isDark;
  }
  changeTheme();
}
binButton();
onLoadTheme();
darkMode.addEventListener('click', changeTheme);
if (document.querySelector('meta[property="og:title"]') != null) {
  let realapp = document.createElement('script');
  realapp.onload = function () {
    console.info("The rest of `app.js` was loaded");
  }
  realapp.src = "/files/js/modules/realapp.js";
  document.body.appendChild(realapp);
}