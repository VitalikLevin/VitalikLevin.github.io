const cachedT = document.title;
const now = new Date();
const promoApp = document.getElementById('promoPWA');
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
function betterDialog() {
  var dialArr = document.querySelectorAll('dialog');
  for (let d = 0; d < dialArr.length; d++) {
    const dialog = dialArr[d];
    dialog.addEventListener('click', function(evt){
      if (evt.target.tagName !== 'DIALOG') { return; }
      const rect = evt.target.getBoundingClientRect();
      const clickedInDialog = (
        rect.top <= evt.clientY &&
        evt.clientY <= rect.top + rect.height &&
        rect.left <= evt.clientX &&
        evt.clientX <= rect.left + rect.width
      );
      if (clickedInDialog === false) {
        dialog.close();
        document.querySelector('body').classList.remove('lockScroll');
      }
    });
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
function sharePage() {
  if ('share' in window.navigator) {
    navigator.share({
      title: cachedT,
      text: `Check out Network Worms website`,
      url: document.querySelector('link[rel=canonical]').href
    })
    .catch((er) => { console.warn(`Share error | ${er}`); });
  }
}
function getAdvice() {
  fetch(`/files/texts/advice-${document.querySelector('html').lang.toLowerCase()}.txt`)
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
        document.getElementById('sleep').innerHTML = `${array[i]}<br>`;
        i++;
        localStorage.setItem('i', i);
      }
    });
}
checkCookies();
betterDialog();
getAdvice();
ifUserHasGone();
document.getElementById('share').addEventListener('click', sharePage);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.warn(`Service worker’s fail | ${err}`));
}
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  var deferredPrompt = e;
  var lastClose = localStorage.getItem('promoClose');
  if (!lastClose || (+lastClose + 3888000) > now) {
    promoApp.hidden = false;
  }
  document.getElementById('instPwa').onclick = () => {
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