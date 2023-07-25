const lang = document.querySelector('html').getAttribute('lang');
const now = new Date();
var sleepArrEN = [
  'I recommend you to sleep.',
  'Press <kbd>Alt</kbd>+<kbd>F4</kbd> on your computer’s desktop screen to turn it off.',
  'Type <code>theme=none</code> in <code>jekyllSiteRoot/_config.yml</code> to delete <em>mysterious</em> `<code>/assets/css/style.css</code>` file.'
];
var sleepArrRU = [
  'Советую тебе поспать, <code contenteditable="true">username</code>.',
  'Чтобы повернуть элемент с помощью <code>CSS</code>, напиши <code>.yourSelector { transform: rotate([0.1-1.0]spin); }</code>.',
  'С помощью &#123;&#37; include &#37;&#125; в Jekyll можно вставлять HTML-код, изображения в формате SVG...'
];
function checkCookies(){
  let cookieDate = localStorage.getItem('cookieDate');
  let cooknote = document.querySelector('#cooknote');
  let cookieBtn = cooknote.querySelector('.cookagree');
  if( !cookieDate || (+cookieDate + 31536000000) < now){
    cooknote.classList.add('show');
  }
  cookieBtn.addEventListener('click', function(){
    localStorage.setItem('cookieDate', now);
    cooknote.classList.remove('show');
  })
}
checkCookies();
ifUserHasGone();
window.onload = () => {
  const sleepElement = document.querySelector('#sleep');
  const advice = localStorage.getItem('advice');
  i = 0;
  if (advice && advice != i) {
    i = advice;
    if (i / sleepArrEN.length >= 1) { i = 0; }
  }
  if ((now.getHours() > 22 || now.getHours() < 6)) {
    if (lang == 'ru' || lang == 'ru-RU') {
      sleepElement.innerHTML = sleepArrRU[i] + '<br>';
    } else {
      sleepElement.innerHTML = sleepArrEN[i] + '<br>';
    }
    i++;
    localStorage.setItem('advice', i);
  }
}
function ifUserHasGone(){
  let a = document.title;
  let t = document.querySelector('title');
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState == 'hidden') {
      t.innerHTML = ':( NW410 Gone from tab';
    } else {
      t.innerHTML = a;
    }
  })
}