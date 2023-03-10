function checkCookies(){
  let cookieDate = localStorage.getItem('cookieDate');
  let cooknote = document.querySelector('#cooknote');
  let cookieBtn = cooknote.querySelector('.cookagree');
  if( !cookieDate || (+cookieDate + 31536000000) < Date.now()){
      cooknote.classList.add('show');
  }
  cookieBtn.addEventListener('click', function(){
    localStorage.setItem('cookieDate', Date.now());
    cooknote.classList.remove('show');
  })
}
checkCookies();
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const doc = document.querySelector('html');
  const sleepText = document.querySelector('#sleep');
  const lang = doc.getAttribute('lang');
  if ((now.getHours () > 22 || now.getHours () < 6)) {
    if (lang == 'ru' || lang == 'ru-RU') {
      sleepText.innerHTML = 'Сон полезен не только в играх с открытым миром.<br>';
    } else {
      sleepText.innerHTML = 'I recommend you to sleep.<br>';
    }
  }
});
window.onload = function(){
  let a = document.title;
  let t = document.querySelector('title');
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState == 'hidden'){
      t.innerHTML = ':( 410 Gone';
    } else {
      t.innerHTML = a;
    }
  })
}