const lang = document.querySelector('html').lang.toLowerCase();
const now = new Date();
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
function noSupport() {
  if (fetch == undefined) {
    document.querySelector('header').innerHTML += '<blockquote class="warn">Your browser doesn’t support a bunch of website’s functions.</blockquote>';
    var style = document.createElement('style');
    style.innerHTML = 'header, main { display: block; }\ndialog { display: none; }';
    document.head.appendChild(style);
  }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(err));
}
noSupport();
checkCookies();
binButton();
getAdvice();
ifUserHasGone();
