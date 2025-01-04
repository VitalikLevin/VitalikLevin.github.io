"use strict";
function betterVideo() {
  let videoArr = document.querySelectorAll("figure > video");
  const supportsVideo = !!videoArr[0].canPlayType("video/mp4");
  if (supportsVideo != true) { return; }
  for (let v = 0; v < videoArr.length; v++) {
    const vidElem = videoArr[v];
    let vidControls = vidElem.nextElementSibling.nextElementSibling;
    const vidPlay = vidControls.firstElementChild;
    const vidGoFull = vidControls.lastElementChild;
    vidControls.setAttribute("data-state", "visible");
    vidPlay.onclick = function() {
      if (vidElem.paused || vidElem.ended) {
        vidPlay.setAttribute("data-state", "play");
        vidPlay.textContent = "\u23f8";
        vidElem.play();
      } else {
        vidPlay.setAttribute("data-state", "pause");
        vidPlay.textContent = "\u25b6";
        vidElem.pause();
      }
    }
    if (!document?.fullscreenEnabled) {
      vidGoFull.style.display = "none";
    } else {
      vidGoFull.onclick = function() {
        if (document.fullscreenElement !== null) {
          setFullscreenData(false, vidElem);
          document.exitFullscreen();
        } else {
          vidElem.requestFullscreen();
          setFullscreenData(true, vidElem);
        }
      }
      document.addEventListener("fullscreenchange", function() {
        setFullscreenData(!!document.fullscreenElement, vidElem);
      });
    }
    vidElem.controls = false;
  }
}
function setFullscreenData(state, vidElement) {
  vidElement.setAttribute("data-fullscreen", !!state);
  vidElement.controls = !!state;
}
betterVideo();