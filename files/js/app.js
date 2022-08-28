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
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/files/js/sw.js', { scope: '/' }).then(() => {
          console.log('Service Worker registered successfully.');
        }).catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
}