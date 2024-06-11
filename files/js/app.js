const darkMode = document.getElementById('darkMode');
function compareNum(a, b) { return a - b; }
function binButton() {
  var binArr = document.querySelectorAll('button.bin');
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
  if (darkMode.innerText != '1') {
    document.querySelector('link[href="/files/css/dark.css"]').setAttribute('href', '/files/css/light.css');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f4f4f4');
    localStorage.setItem('isDark', 1);
  } else {
    let temp = document.querySelector('link[href="/files/css/light.css"]');
    if (temp) { temp.setAttribute('href', '/files/css/dark.css'); }
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#000000');
    localStorage.setItem('isDark', darkMode.innerText);
  }
}
function onLoadTheme() {
  let isDark = localStorage.getItem('isDark');
  if (!isDark) {
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
  var realapp = document.createElement('script');
  realapp.onload = function () {
    console.info("The rest of `app.js` was loaded");
  }
  realapp.src = "/files/js/realapp.js";
  document.body.appendChild(realapp);
}