function checkCookies(){
  let cookieDate = localStorage.getItem('cookieDate');
  let cooknote = document.querySelector('#cooknote');
  let cookieBtn = cooknote.querySelector('.cookagree');
  if( !cookieDate || (+cookieDate + 31536000000) < Date.now() ){
      cooknote.classList.add('show');
  }
  cookieBtn.addEventListener('click', function(){
    localStorage.setItem( 'cookieDate', Date.now() );
    cooknote.classList.remove('show');
  })
}
checkCookies();
window.onload = function(){
  var a = document.title;
  var gone = ':( 410 Gone';
  var t = document.querySelector('title');
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState == 'hidden'){
      t.innerHTML = gone;
    } else {
      t.innerHTML = a;
    }
  })
}