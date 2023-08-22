const lang = document.querySelector('html').lang.toLowerCase();
const now = new Date();
const promoApp = document.getElementById('promoPWA');
const promoYes = document.getElementById('instPwa');
const promoNo = document.getElementById('insClose');
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
    var button = binArr[a];
    button.onclick = function() {
      if (button.innerText != '1') {
        button.innerText = '1';
      } else {
        button.innerText = '0';
      }
    }
  }
}
function ifUserHasGone() {
  const cachedT = document.title;
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState == 'hidden') {
      document.title = ':( NW410 Gone from tab';
    } else {
      document.title = cachedT;
    }
  });
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
getAdvice();
ifUserHasGone();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(err));
}
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  var deferredPrompt = e;
  let lastClose = localStorage.getItem('promoClose');
  if (!lastClose || (+lastClose + 3888000) > now) {
    promoApp.hidden = false;
  }
  promoYes.onclick = (ev) => {
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
  promoNo.onclick = (evt) => {
    promoApp.hidden = true;
    localStorage.setItem('promoClose', now);
    deferredPrompt = null;
  }
});