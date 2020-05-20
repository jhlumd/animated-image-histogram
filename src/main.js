// state
const colorMap = new Map();
let currentStageIsImage = true; // true = image, false = histogram
let ctx;
let highestBinCount = 0;
let width;
let height;
let urlInputValue;

const img = new Image();
img.crossOrigin = "Anonymous";

// function to clear currently playing animation
function resetCanvas() {

}


// 1. handle local file upload
const inputTypeFile = document.getElementById("local-file");
inputTypeFile.addEventListener("change", handleLocalFile);

function handleLocalFile(e) {
  resetCanvas();
  const file = e.currentTarget.files[0];
  img.src = window.URL.createObjectURL(file);
}

// 2. handle image url input
const urlForm = document.getElementById("image-link-form");
urlForm.addEventListener("submit", handleUrlInput);
const urlInput = document.getElementById("image-link");
urlInput.addEventListener("change", handleUrlInputChange)

function handleUrlInput(e) {
  e.preventDefault();
  resetCanvas();
  img.src = urlInputValue;
}
function handleUrlInputChange(e) {
  urlInputValue = e.currentTarget.value;
}

// 3. handle random image from demo button click
const demoButton = document.querySelector(".demo-button");
demoButton.addEventListener("click", onDemoClick);

const listOfDemos = require("./demo_urls");
let lastDemoIdx;

function onDemoClick() {
  resetCanvas();
  let chosenIdx = 0;
  while (chosenIdx === lastDemoIdx) {
    chosenIdx = Math.floor(Math.random() * (listOfDemos.length - 1));
  }
  lastDemoIdx = chosenIdx;
  const chosenUrl = listOfDemos[chosenIdx];
  img.src = chosenUrl;
}

// 4. When image is loaded, do this
const canvas = document.getElementById("canvas");
img.addEventListener("load", onImageLoad);

function onImageLoad() {
  width = img.width;
  height = img.height;
  canvas.width = width;
  canvas.height = height;

  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // get pixel data
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const color = chroma(r, g, b);
    const lightness = color.get("hsl.l");
    let pixelInfo = colorMap.get(lightness);
    if (!pixelInfo) {
      pixelInfo = [];
      colorMap.set(lightness, pixelInfo);
    }
    pixelInfo.push({
      x: Math.floor((i % (width * 4)) / 4),
      y: Math.floor(i / (width * 4)),
      duration: Math.round(Math.random() * 120) + 30,
      frame: 0,
      destX: 0,
      destY: 0,
      color,
    });

    // find the highest bin
    if (pixelInfo.length > highestBinCount) highestBinCount = pixelInfo.length;
  }

  // calculate destX and destY for everything in colorMap
  colorMap.forEach((arr, key) => {
    const xOffset = key * width;

    arr.forEach((point, idx) => {
      point.destX = xOffset;
      point.destY = height * 0.95 - (0.95 * height * idx) / highestBinCount;
    });
  });

  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1000);
}

function draw() {
  let hasMore = false;

  ctx.fillStyle = "#13294f";
  ctx.fillRect(0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  colorMap.forEach((arr) => {
    arr.forEach((point) => {
      const t = interpolate(point.frame / point.duration);

      if (currentStageIsImage && point.frame < point.duration) {
        point.frame++;
        hasMore = true;
      } else if (!currentStageIsImage && point.frame > 0) {
        point.frame--;
        hasMore = true;
        if (point.frame > 0) point.frame--;
      }

      const x = Math.round(lerp(point.x, point.destX, t));
      const y = Math.round(lerp(point.y, point.destY, t));

      const idx = (x + y * width) * 4;
      const color = point.color._rgb;
      pixels[idx] = color[0];
      pixels[idx + 1] = color[1];
      pixels[idx + 2] = color[2];
      pixels[idx + 3] = color[3] * 255;
    });
  });

  // draw the pixels since they are all updated
  ctx.putImageData(imgData, 0, 0);

  if (hasMore) {
    requestAnimationFrame(draw);
  } else {
    currentStageIsImage = !currentStageIsImage;
    setTimeout(() => requestAnimationFrame(draw), 1000);
  }

}

function interpolate(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return b * t + a * (1 - t);
}