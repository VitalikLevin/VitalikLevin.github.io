var audioFile = "/files/audio/huh.wav";
const audioPlay = async url => {
  var random = (Math.random() * 10 / 10).toFixed(1);
  const context = new AudioContext();
  var gainNode = context.createGain();
  const source = context.createBufferSource();
  const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  gainNode.gain.setValueAtTime(random, context.currentTime);
  source.start();
};
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.hostname != "vitaliklevin.github.io") {
    audioFile = "https://vitaliklevin.github.io" + audioFile;
  }
  document.querySelector("#logo").onclick = () => audioPlay(audioFile);
  window.onkeydown = (e) => {
    if((e.key == "F5") || (e.key.toLowerCase() == "r" && e.ctrlKey) || e.shiftKey) {
      e.preventDefault();
      audioPlay(audioFile);
    }
  };
});