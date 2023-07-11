var audio = new Audio("/files/audio/huh.wav");
audio.preload = "auto";
document.addEventListener("DOMContentLoaded", function() {
  audio.oncanplaythrough = function() { audio.play };
});