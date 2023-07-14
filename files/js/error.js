var audio = new Audio("/files/audio/huh.wav");
audio.preload = "auto";
const audioCtx = new (AudioContext || window.webkitAudioContext)();
document.addEventListener("DOMContentLoaded", () => {
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(audioCtx.destination);
  document.querySelector("#logo").onclick = function() { audio.play(); }
  window.onkeydown = (e) => {
    if((e.key == "F5") || (e.key.toLowerCase() == "r" && e.ctrlKey)) {
      e.preventDefault();
      audio.play();
    }
  };
});