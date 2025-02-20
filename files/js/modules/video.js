"use strict";
function betterVideo() {
  let videoArr = document.querySelectorAll("figure > video");
  const supportsVideo = !!videoArr[0].canPlayType("video/mp4");
  if (supportsVideo != true) { return; }
  for (let v = 0; v < videoArr.length; v++) {
    const vidElem = videoArr[v];
    let vidControls = vidElem.nextElementSibling.nextElementSibling;
    const vidPlay = vidControls.firstElementChild;
    const vidDown = vidPlay.nextElementSibling;
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
    vidDown.onclick = function() {
      let vidLink = document.createElement("a");
      let vidSrc = vidElem.firstElementChild.getAttribute("src");
      vidLink.href = vidSrc;
      vidLink.download = vidSrc.slice(vidLink.href.lastIndexOf("/"), vidSrc.length);
      vidLink.click();
      vidLink.remove();
    }
    if (!document?.fullscreenEnabled) {
      vidGoFull.setAttribute("data-state", "hidden");
    } else {
      vidGoFull.onclick = function() {
        const vidTitle = vidElem.getAttribute("title");
        if (document.fullscreenElement !== null) {
          setFullscreenData(false, vidElem);
          vidElem.setAttribute("title", vidTitle);
          document.exitFullscreen();
        } else {
          vidElem.requestFullscreen();
          vidElem.removeAttribute("title");
          setFullscreenData(true, vidElem);
        }
      }
      document.addEventListener("fullscreenchange", function() {
        setFullscreenData(!!document.fullscreenElement, vidElem);
      });
    }
    vidElem.parentElement.addEventListener("keydown", function(ev) {
      if (ev.key.toLowerCase() == "p" || ev.key == " ") {
        ev.preventDefault();
        vidPlay.click();
      }
      if (ev.key.toLowerCase() == "f" && vidGoFull.getAttribute("data-state") != "hidden") {
        vidGoFull.click();
      }
      if (ev.ctrlKey && ev.key.toLowerCase() == "s") {
        ev.preventDefault();
        vidDown.click();
      }
    });
    vidElem.onclick = function(evt) {
      evt.preventDefault();
      vidPlay.click();
    }
    vidElem.controls = false;
  }
}
function setFullscreenData(state, vidElement) {
  vidElement.setAttribute("data-fullscreen", !!state);
  vidElement.controls = !!state;
}
betterVideo();