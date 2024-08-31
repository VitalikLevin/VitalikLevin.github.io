let canvas = document.getElementById("action");
let canMisc = document.getElementById("misc");
let canBack = document.getElementById("back");
const shareBtn = document.getElementById("share");
var context = canvas.getContext("2d");
var ctxM = canMisc.getContext("2d");
let ctxB = canBack.getContext("2d", {alpha: false});
let grid = 16;
let gridWidth = Math.ceil(canvas.width / grid);
let gridHeight = Math.ceil(canvas.height / grid);
const appleColors = ["#f10000", "#ffd100", "#00be00", "#283593"];
let gameOver = false;
let isPaused = false;
let justEating = false;
let walls = [];
let applesEaten = 0;
var timeSinceStart = 0;
var lastFrameDate = 0;
var gameSlower = 1;
var snake = {
  x: 128, y: 160,
  dx: grid, dy: 0,
  cells: [], maxCells: 4
};
var apple = {
  x: 192, y: 160, colorId: 0
};
async function playSound(url, volume=localStorage.getItem("siteVol")) {
  if (volume == 0) {
    return;
  }
  const audioCtx = new AudioContext();
  let gainNode = audioCtx.createGain();
  const source = audioCtx.createBufferSource();
  const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  source.start();
}
function addWall(gridX, gridY) {
  walls.push({x: gridX * grid, y: gridY * grid});
}
function intro() {
  let bestLunch = localStorage.getItem("bestLunch");
  let longestLunch = localStorage.getItem("longestLunch");
  canvas.width = canvas.getBoundingClientRect().width - (canvas.getBoundingClientRect().width % grid);
  canvas.height = canvas.getBoundingClientRect().height - (canvas.getBoundingClientRect().height % grid);
  canvas.classList.remove("noSize");
  canMisc.width = canvas.width;
  canMisc.height = canvas.height;
  canMisc.classList.remove("noSize");
  canBack.width = canvas.width;
  canBack.height = canvas.height;
  canBack.classList.remove("noSize");
  ctxB.fillStyle = "#376a01";
  ctxB.fillRect(0, 0, canvas.width, canvas.height);
  gridWidth = Math.trunc(canvas.width / grid);
  gridHeight = Math.trunc(canvas.height / grid);
  if (window.matchMedia("(orientation: portrait)").matches) {
    gameSlower = 2.5;
    macroPad();
  }
  for (let w = 0; w < gridHeight; w++) {
    addWall(0, w);
  }
  for (let wa = 1; wa < gridWidth; wa++) {
    addWall(wa, 0);
  }
  for (let wal = 1; wal < gridHeight; wal++) {
    addWall(gridWidth - 1, wal);
  }
  for (let wall = 1; wall < gridWidth - 1; wall++) {
    addWall(wall, gridHeight - 1);
  }
  ctxM.clearRect(0, 0, canvas.width, canvas.height);
  ctxM.fillStyle = "#fdd835";
  ctxM.font = `${grid*2}px jbmono`;
  ctxM.textAlign = "center";
  ctxM.textBaseline = "middle";
  ctxM.textRendering = "optimizeLegibility";
  ctxM.fillText("CLICK TO PLAY", canvas.width / 2, canvas.height / 2);
  ctxM.font = `20px jbmono`;
  if (bestLunch > 0) {
    ctxM.fillText(`HI-SCORE ${bestLunch}`, canvas.width - grid * 5, grid * 2);
  }
  if (longestLunch > 0) {
    ctxM.fillText(`TIME ${Math.round(longestLunch / 60)}m ${longestLunch % 60}s`, grid * 5, grid * 2);
  }
  return;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function loop() {
  requestAnimationFrame(loop);
  var deltaTime = Date.now() - lastFrameDate;
  if (deltaTime < 40 * gameSlower) {
    return;
  }
  timeSinceStart += deltaTime;
  lastFrameDate = Date.now();
  if (gameOver == true) {
    timeSinceStart -= deltaTime;
    if (shareBtn.hasAttribute("hidden")) { shareBtn.removeAttribute("hidden"); }
    if (applesEaten > localStorage.getItem("bestLunch")) {
      localStorage.setItem("bestLunch", applesEaten);
    }
    if (Math.floor(timeSinceStart / 1000) > localStorage.getItem("longestLunch")) {
      localStorage.setItem("longestLunch", `${Math.floor(timeSinceStart / 1000)}`);
    }
    ctxM.clearRect(0, 0, canvas.width, canvas.height);
    ctxM.fillStyle = "#fdd835";
    ctxM.font = `${grid*2.5}px jbmono`;
    ctxM.fillText("GAME OVER ;(", canvas.width / 2, canvas.height / 2);
    ctxM.font = `italic ${grid*1.5}px jbmono`;
    ctxM.fillText("CLICK TO RESTART", canvas.width / 2, canvas.height / 2 + grid * 4);
    canMisc.addEventListener("click", playAgain, false);
    return;
  }
  if (isPaused == true) {
    timeSinceStart -= deltaTime;
    return;
  }
  gameOver = false;
  justEating = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx;
  snake.y += snake.dy;
  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  context.fillStyle = "#111d11";
  context.fillRect(apple.x + 6, apple.y - 1, 2, 2);
  context.fillStyle = appleColors[apple.colorId];
  context.fillRect(apple.x, apple.y + 1, grid - 1, grid - 2);
  context.fillStyle = "#111d11";
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      playSound("/files/audio/snake-bite.ogg");
      apple.colorId = getRandomInt(0, appleColors.length - 1);
      apple.x = getRandomInt(1, gridWidth - 2) * grid;
      apple.y = getRandomInt(1, gridHeight - 2) * grid;
      applesEaten += 1;
      justEating = true;
    }
    for (var i = index + 1; i < snake.cells.length; i++) {
      for (let W = 0; W < walls.length; W++) {
        if (cell.x === walls[W].x && cell.y === walls[W].y) {
          playSound("/files/audio/got-in-wall.ogg");
          gameOver = true;
        }
      }
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        playSound("/files/audio/got-in-self.ogg");
        gameOver = true;
      }
    }
  });
  context.fillStyle = "#376a01";
  if (snake.dx != 0) {
    if (snake.dy > 0) {
      context.fillRect(snake.x + 9, snake.y + 2, 4, 4);
      context.fillRect(snake.x + 9, snake.y + 9, 4, 4);
    } else {
      context.fillRect(snake.x + 9, snake.y + 2, 4, 4);
      context.fillRect(snake.x + 9, snake.y + 9, 4, 4);
    }
  } else {
    context.fillRect(snake.x + 2, snake.y + 9, 4, 4);
    context.fillRect(snake.x + 9, snake.y + 9, 4, 4);
  }
  if (justEating) {
    ctxM.clearRect(canvas.width - grid * 4, grid + 1, grid * 3, grid * 3);
    ctxM.fillStyle = "#fdd835";
    ctxM.font = "20px jbmono";
    ctxM.fillText(applesEaten, canvas.width - grid * 2, grid * 2);
  }
  document.getElementById("score").innerText = `${Math.floor(timeSinceStart / 1000)}`;
}
function drawWall() {
  ctxB.fillStyle = "#111d11";
  for (let wl = 0; wl < walls.length; wl++) {
    const justWall = walls[wl];
    ctxB.fillRect(justWall.x + 1, justWall.y + 1, 6, 6);
    ctxB.fillRect(justWall.x + 1, justWall.y + 8, 6, 6);
    ctxB.fillRect(justWall.x + 8, justWall.y + 1, 6, 6);
    ctxB.fillRect(justWall.x + 8, justWall.y + 8, 6, 6);
  }
  return;
}
function playAgain() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  ctxM.clearRect(0, 0, canvas.width, canvas.height);
  gameOver = false;
  justEating = false;
  snake.dx = grid;
  snake.dy = 0;
  snake.x = grid * 6;
  snake.y = grid * 3;
  snake.cells = [];
  snake.maxCells = 4;
  applesEaten = 0;
  timeSinceStart = 0;
  requestAnimationFrame(loop);
  shareBtn.setAttribute("hidden", "");
  canMisc.removeEventListener("click", playAgain, false);
}
document.addEventListener("keydown", function(e) {
  if ((e.key == "ArrowLeft" || e.key.toLowerCase() == "a") && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if ((e.key == "ArrowUp" || e.key.toLowerCase() == "w") && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if ((e.key == "ArrowRight" || e.key.toLowerCase() == "d") && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if ((e.key == "ArrowDown" || e.key.toLowerCase() == "s") && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
  if (e.key == "Pause" && timeSinceStart > 0 && gameOver == false) {
    if (isPaused) {
      isPaused = false;
      ctxM.clearRect(canvas.width / 2 - grid * 3, canvas.height / 2 - grid * 3, grid * 6, grid * 6);
    } else {
      isPaused = true;
      ctxM.font = `${grid*2.5}px wfnotdef`;
      ctxM.fillText("\u23f8", canvas.width / 2, canvas.height / 2);
    }
  }
});
canMisc.addEventListener("click", function firstTry() {
  ctxM.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawWall);
  lastFrameDate = Date.now();
  requestAnimationFrame(loop);
  canMisc.removeEventListener("click", firstTry, false);
}, false);
shareBtn.addEventListener("click", shareRes);
function macroPad() {
  let btns = document.querySelectorAll("button[data-key]");
  for (let a = 0; a < btns.length; a++) {
    const btn = btns[a];
    btn.onclick = function() {
      document.dispatchEvent(new KeyboardEvent("keydown", {"key": btn.getAttribute("data-key")}));
    }
  }
}
function shareRes() {
  let curDate = new Date(lastFrameDate).toISOString();
  let curName = curDate.slice(0, curDate.lastIndexOf(".")).replace("T", " ");
  let cameraX = 0 - grid;
  let cameraY = grid;
  const justACanvas = document.createElement("canvas");
  if (canvas.height - grid * 2 > canvas.width) {
    if (snake.y >= canvas.width) {
      cameraY = 0 - (snake.y - grid * 2);
    }
    if (snake.y >= canvas.height - canvas.width) {
      cameraY = 0 - (canvas.height - canvas.width - grid);
    }
    justACanvas.width = canvas.width + grid * 2;
    justACanvas.height = canvas.width + grid * 5;
  } else {
    if (snake.x >= canvas.height) {
      cameraX = snake.x - grid * 2;
    }
    if (snake.x + canvas.height >= canvas.width) {
      cameraX = (canvas.width - canvas.height) - grid;
    }
    if (canvas.height > canvas.width) {
      cameraX = 0 - ((canvas.height - canvas.width) / 2) - grid;
    }
    justACanvas.width = canvas.height + grid * 2;
    justACanvas.height = canvas.height + grid * 5;
  }
  let itsCtx = justACanvas.getContext("2d");
  itsCtx.drawImage(canBack, 0 - cameraX, cameraY);
  itsCtx.drawImage(canvas, 0 - cameraX, cameraY);
  itsCtx.fillStyle = "#eeeeee";
  itsCtx.fillRect(0, 0, justACanvas.width, grid);
  itsCtx.fillRect(0, grid, grid, justACanvas.height);
  itsCtx.fillRect(0, justACanvas.height - grid * 4, justACanvas.width, grid * 4);
  itsCtx.fillRect(justACanvas.width - grid, grid, grid, justACanvas.height);
  itsCtx.fillStyle = "#283593";
  itsCtx.textBaseline = "middle";
  itsCtx.textAlign = "center";
  itsCtx.font = `${grid - 2}px jbmono,wfnotdef`;
  itsCtx.fillText(`\ud83d\uddc0 Snake-${curName} UTC+0`, justACanvas.width / 2, grid / 2);
  itsCtx.font = `${grid*2}px jbmono,wfnotdef`;
  itsCtx.fillText(`\ud83c\udf74${applesEaten}  \u231b${Math.floor(timeSinceStart / 60000)}m${Math.floor((timeSinceStart % 60000) / 1000)}s`, justACanvas.width / 2, justACanvas.height - grid * 2);
  justACanvas.toBlob(function(imgBlob) {
    let itsImg = document.querySelector(".dialtext p img");
    let itsLink = document.createElement("a");
    itsLink.href = URL.createObjectURL(imgBlob);
    itsImg.src = itsLink.href;
    document.getElementById("savePic").addEventListener("click", function() {
      itsLink.download = `snake-${curName.replace(" ", "-").replaceAll(":", "∶")}-utc0.png`;
      itsLink.click();
    });
    document.getElementById("preRes").showModal();
  }, "image/png");
}
requestAnimationFrame(intro);