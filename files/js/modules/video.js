"use strict";
function betterMedia() {
  let videoArr = document.querySelectorAll("figure > video");
  let audioArr = Array.from(document.querySelectorAll("figure > audio"));
  if (audioArr != []) {
    videoArr = Array.from(videoArr).concat(audioArr);
  }
  const supportsVideo = !!videoArr[0].canPlayType("video/mp4");
  if (supportsVideo != true) { return; }
  for (let v = 0; v < videoArr.length; v++) {
    const vidElem = videoArr[v];
    let vidControls = vidElem.parentElement.querySelector(".controls");
    const vidPlay = vidControls.querySelector(".play");
    const vidDown = vidControls.querySelector(".dl");
    const vidMute = vidControls.querySelector(".mute");
    const vidSeekbar = vidControls.querySelector("progress");
    const vidGoFull = vidControls.querySelector(".fs");
    vidControls.setAttribute("data-state", "visible");
    vidPlay.onclick = function() {
      if (vidElem.paused || vidElem.ended) {
        vidElem.play();
      } else {
        vidElem.pause();
      }
    }
    if (vidSeekbar != null) {
      vidSeekbar.onclick = function(e) {
        let thePos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				vidElem.currentTime = Math.trunc(thePos * vidElem.duration * 100) / 100;
      }
      vidElem.addEventListener("timeupdate", function() {
        if (!vidSeekbar.getAttribute("max")) { vidSeekbar.setAttribute("max", vidElem.duration); }
        vidSeekbar.value = Math.trunc(vidElem.currentTime * 100) / 100;
      });
    }
    if (vidMute != null) {
      vidMute.onclick = function() {
        vidElem.muted = !vidElem.muted;
        updateMuteBtn(vidElem.muted, vidMute);
      }
      vidElem.addEventListener("volumechange", function() {
        updateMuteBtn(vidElem.muted, vidMute);
      });
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
    if (!document?.fullscreenEnabled || vidElem.tagName.toLowerCase() == "audio") {
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
      if (ev.key.toLowerCase() == "m" && vidMute != null) {
        vidMute.click();
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
    vidElement.setAttribute("title", vidElement.getAttribute("data-real-title"));
  } else {
    if (vidElement.getAttribute("data-real-title") == null) {
      vidElement.setAttribute("data-real-title", vidElement.getAttribute("title"));
    }
    vidElement.removeAttribute("title");
  }
}
function updateMuteBtn(isMuted, muteBtn) {
  if (isMuted) {
    muteBtn.textContent = "\uD83D\uDD07";
  } else {
    muteBtn.textContent = "\uD83D\uDD08";
  }
}
betterMedia();