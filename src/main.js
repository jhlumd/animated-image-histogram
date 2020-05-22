/* ----- Mobile only ----- */
// Collapse options menu on options button click and various file input methods
const optionsButton = document.querySelector(".options-button");
optionsButton.addEventListener("click", toggleOptions);

function toggleOptions() {
  if (window.innerWidth > 819) return;
  topSection.classList.toggle("collapsed");
  if (topSection.classList.contains("collapsed")) {
    optionsButton.innerHTML = "<i class='fas fa-sliders-h'></i> Options";
  } else {
    optionsButton.innerHTML = "<i class='fas fa-sliders-h'></i> Hide Options";
  }
}


/* ----- Various input types for the image: ----- */
/*
1) local file
2) url input
3) demo
4) apply with new options
*/

const img = new Image();
img.crossOrigin = "Anonymous";

// 1. handle local file upload
const inputTypeFile = document.getElementById("local-file");
inputTypeFile.addEventListener("change", handleLocalFile);

function handleLocalFile(e) {
  clearOldAnimation();
  toggleOptions();
  const file = e.currentTarget.files[0];
  img.src = window.URL.createObjectURL(file);
}

// 2. handle image url input
const urlInput = document.getElementById("image-link");
urlInput.addEventListener("change", handleUrlInputChange);
const urlForm = document.getElementById("image-link-form");
urlForm.addEventListener("submit", handleUrlInput);

let urlInputValue;
function handleUrlInputChange(e) {
  urlInputValue = e.currentTarget.value;
}

function handleUrlInput(e) {
  e.preventDefault();
  clearOldAnimation();
  toggleOptions();
  img.src = urlInputValue;
}

// 3. handle random image from demo button click
const listOfDemos = require("./lib/demo_urls");
const demoButton = document.querySelector(".demo-button");
demoButton.addEventListener("click", onDemoClick);

let lastDemoIdx;
function onDemoClick() {
  clearOldAnimation();
  if (!topSection.classList.contains("collapsed")) toggleOptions();

  let chosenIdx;
  while (chosenIdx === lastDemoIdx) {
    chosenIdx = Math.floor(Math.random() * (listOfDemos.length - 1));
  }
  lastDemoIdx = chosenIdx;
  const chosenUrl = listOfDemos[chosenIdx];
  urlInput.value = chosenUrl;
  img.src = chosenUrl;
}

// 4. apply option changes
function handleApplyChanges() {
  clearOldAnimation();
  toggleOptions();

}

/* ----- All necessary cancelAnimationFrame()'s ----- */
function clearOldAnimation() {

}

/* ----- When image is loaded, do this ----- */
img.addEventListener("load", onImageLoad);

// state
const canvas = document.getElementById("canvas");
let width;
let height;
let ctx;
const colorMap = new Map();
let highestBinCount = 0;

let currentStageIsImage = true; // true = image, false = histogram

let aniReq1;

let aniReq2;
let aniReq3;

let firstStart = true;

function onImageLoad() {
  if (firstStart) {
    // Reveal play/pause button
    document.querySelector(".top-menu").classList.add("show-play");
  } else {
    resetAll();
  }
  firstStart = false;

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
    aniReq1 = requestAnimationFrame(draw);
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
    console.log("IN HAS MORE!!", currentStageIsImage);
    aniReq2 = requestAnimationFrame(draw);
  } else {
    console.log("IN NOT HAVE MORE!!", currentStageIsImage);
    // currentStageIsImage = !currentStageIsImage;
    // setTimeout(() => {
    //   aniReq3 = requestAnimationFrame(draw);
    // }, 1000);
  }

}

function interpolate(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return b * t + a * (1 - t);
}