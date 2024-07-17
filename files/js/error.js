var audioFile = "/files/audio/huh.wav";
async function playSound(url, volume=Math.random()) {
  const context = new AudioContext();
  let gainNode = context.createGain();
  const source = context.createBufferSource();
  const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  source.start();
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#logo").onclick = () => playSound(audioFile);
  window.onkeydown = (e) => {
    if ((e.key == "F5") || (e.key.toLowerCase() == "r" && e.ctrlKey) || e.shiftKey) {
      e.preventDefault();
      playSound(audioFile);
    }
  };
});