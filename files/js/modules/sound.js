const siteSound = document.getElementById("siteSound");
function onLoadSound() {
  let siteVol = localStorage.getItem("siteVol");
  if (siteVol == '' || siteVol == undefined) {
    siteSound.value = 1;
  } else {
    siteSound.value = siteVol;
  }
  changeVolume();
}
function changeVolume() {
  document.getElementById("soundVol").textContent = `${siteSound.value * 100}%`;
  localStorage.setItem("siteVol", siteSound.value);
}
onLoadSound();
siteSound.addEventListener("change", changeVolume);