const cachedT = document.title;
const now = new Date();
const promoApp = document.getElementById('promoPWA');
let showArrow = document.getElementById('showTopArrow');
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
function ifUserHasGone() {
  document.addEventListener('visibilitychange', function() {
    window.setInterval(function() {
      if (document.visibilityState == 'hidden') {
        const goneArr = [':(', ':|', ';('];
        document.title = `${goneArr[Math.floor(Math.random() * goneArr.length)]} NW410 Gone from tab`;
      } else {
        document.title = cachedT;
      }
    }, 3000);
  });
}
function changeArrowVisibility() {
  if (Number(showArrow.innerText) != 1) {
    document.querySelector('.imgs .top').classList.remove('show');
  } else {
    document.querySelector('.imgs .top').classList.add('show');
  }
  localStorage.setItem('showTop', showArrow.innerText);
}
function onloadShowArrow() {
  let isArrowVisible = localStorage.getItem('showTop');
  if (isArrowVisible == '' || isArrowVisible == undefined) {
    localStorage.setItem('showTop', '0');
  } else {
    showArrow.innerText = isArrowVisible;
  }
  changeArrowVisibility();
}
function sharePage() {
  if ('share' in window.navigator) {
    navigator.share({
      title: cachedT,
      text: `Check out Network Worms website`,
      url: document.querySelector('link[rel=canonical]').href
    })
    .catch((er) => {console.warn(`Sharing error | ${er}`); });
  } else if ('clipboard' in window.navigator) {
    navigator.clipboard.writeText(`${cachedT} — ${document.querySelector('link[rel=canonical]').href}`)
      .then(function() { console.info('Thank you for sharing my page :)'); });
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
getAdvice();
ifUserHasGone();
onloadShowArrow();
document.getElementById('share').addEventListener('click', sharePage);
showArrow.addEventListener('click', changeArrowVisibility);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.warn(`Service worker’s fail | ${err}`));
}
if (document.getElementById('shareD') != null) {
  document.getElementById('shareD').onclick = function() {
    document.getElementById('chooseShare').showModal();
    document.querySelector('html').classList.add('lockScroll');
  }
  document.getElementById('sClose').addEventListener('click', function() { document.getElementById('chooseShare').close(); });
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
if (document.querySelector('figure > video') != null) {
  let vidScript = document.createElement('script');
  vidScript.onload = function() {
    console.info("The `video.js` was loaded");
  }
  vidScript.src = "/files/js/modules/video.js";
  document.body.appendChild(vidScript);
}