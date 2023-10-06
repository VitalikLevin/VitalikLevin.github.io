const lang = document.querySelector('html').lang.toLowerCase();
const now = new Date();
const darkMode = document.getElementById('darkMode');
const promoApp = document.getElementById('promoPWA');
const promoYes = document.getElementById('instPwa');
const sleep = document.getElementById('sleep');
function checkCookies() {
  let cookieDate = localStorage.getItem('cookieDate');
  let cooknote = document.querySelector('#cooknote');
  let cookieBtn = cooknote.querySelector('.cookagree');
  if (!cookieDate || (+cookieDate + 31536000000) < now) {
    cooknote.classList.add('show');
  }
  cookieBtn.addEventListener('click', function() {
    localStorage.setItem('cookieDate', now);
    cooknote.classList.remove('show');
  });
}
function compareNum(a, b) { return a - b; }
function binButton() {
  var binArr = document.querySelectorAll('.bin');
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
function onLoadTheme() {
  let isDark = localStorage.getItem('isDark');
  if (!isDark) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches || window.location.search.match(/isdark=1/i)) {
      darkMode.innerText = '1';
    } else {
      darkMode.innerText = '0';
    }
  } else {
    darkMode.innerText = isDark;
  }
  changeTheme();
}
function ifUserHasGone() {
  const cachedT = document.title;
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState == 'hidden') {
      document.title = ':( NW410 Gone from tab';
      localStorage.setItem('isDark', darkMode.innerText);
    } else {
      document.title = cachedT;
    }
  });
}
function changeTheme() {
  if (darkMode.innerText != '1') {
    document.querySelector('link[href="/files/css/dark.css"]').setAttribute('href', '/files/css/light.css');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f4f4f4');
  } else {
    let temp = document.querySelector('link[href="/files/css/light.css"]');
    if (temp) { temp.setAttribute('href', '/files/css/dark.css'); }
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#000000');
  }
}
function getAdvice() {
  fetch(`/files/texts/advice-${lang}.txt`)
    .then(function(resp) {
      return resp.text();
    })
    .then(function(text) {
      let i = 0;
      let array = text.split('\n');
      let cachedI = localStorage.getItem('i');
      if (cachedI != null && cachedI >= i) {
        i = cachedI;
        if (i / array.length >= 1) {
          i = 0;
        }
      }
      if (now.getHours() > 22 || now.getHours() < 6) {
        sleep.innerHTML = `${array[i]}<br>`;
        i++;
        localStorage.setItem('i', i);
      }
    });
}
checkCookies();
binButton();
onLoadTheme();
getAdvice();
ifUserHasGone();
darkMode.addEventListener('click', changeTheme);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(`Service worker’s fail | ${err}`));
}
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  var deferredPrompt = e;
  var lastClose = localStorage.getItem('promoClose');
  if (!lastClose || (+lastClose + 3888000) > now) {
    promoApp.hidden = false;
  }
  promoYes.onclick = () => {
    promoApp.hidden = true;
    deferredPrompt.prompt();
    deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted');
      } else {
        console.log('User dismissed');
        localStorage.setItem('promoClose', now);
      }
      deferredPrompt = null;
    });
  }
  document.getElementById('insClose').onclick = () => {
    promoApp.hidden = true;
    localStorage.setItem('promoClose', now);
    deferredPrompt = null;
  }
});