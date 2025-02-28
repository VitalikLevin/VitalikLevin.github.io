"use strict";
function betterVideo() {
  let videoArr = document.querySelectorAll("figure > video");
  const supportsVideo = !!videoArr[0].canPlayType("video/mp4");
  if (supportsVideo != true) { return; }
  for (let v = 0; v < videoArr.length; v++) {
    const vidElem = videoArr[v];
    let vidControls = vidElem.nextElementSibling;
    const vidPlay = vidControls.firstElementChild;
    const vidDown = vidPlay.nextElementSibling;
    const vidGoFull = vidControls.lastElementChild;
    vidControls.setAttribute("data-state", "visible");
    vidPlay.onclick = function() {
      if (vidElem.paused || vidElem.ended) {
        vidElem.play();
      } else {
        vidElem.pause();
      }
    }
    vidElem.onplay = function() {
      vidPlay.setAttribute("data-state", "play");
      vidPlay.textContent = "\u23f8";
    }
    vidElem.onpause = function() {
      vidPlay.setAttribute("data-state", "pause");
      vidPlay.textContent = "\u25b6";
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
  if (!!state == false) {
    vidElement.parentElement.setAttribute("title", vidElement.getAttribute("data-real-title"));
  } else {
    if (vidElement.getAttribute("data-real-title") == null) {
      vidElement.setAttribute("data-real-title", vidElement.parentElement.getAttribute("title"));
    }
    vidElement.parentElement.removeAttribute("title");
  }
}
betterVideo();