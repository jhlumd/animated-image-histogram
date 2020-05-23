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
    optionsButton.innerHTML = "<i class='fas fa-sliders-h'></i> Hide";
  }
}


/* ----- Various input types for the image: ----- */
const img = new Image();
img.crossOrigin = "Anonymous";
// 1) local file
// 2) url input
// 3) demo
// 4) apply with new options

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
// const listOfDemos = require("./lib/demo_urls");
const listOfDemos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg/300px-Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Van_Gogh_-_Trauernder_alter_Mann.jpeg/300px-Van_Gogh_-_Trauernder_alter_Mann.jpeg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Irises-Vincent_van_Gogh.jpg/300px-Irises-Vincent_van_Gogh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/300px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg/300px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/220px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg/240px-Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Vincent_Van_Gogh_-_Wheatfield_with_Crows.jpg/300px-Vincent_Van_Gogh_-_Wheatfield_with_Crows.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg/300px-Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/De_zaaier_-_s0029V1962_-_Van_Gogh_Museum.jpg/200px-De_zaaier_-_s0029V1962_-_Van_Gogh_Museum.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
];
const demoButton = document.querySelector(".demo-button");
demoButton.addEventListener("click", onDemoClick);

let lastDemoIdx;
let chosenDemoIdx;
function onDemoClick() {
  clearOldAnimation();
  if (!topSection.classList.contains("collapsed")) toggleOptions();

  while (chosenDemoIdx === lastDemoIdx) {
    chosenDemoIdx = Math.floor(Math.random() * (listOfDemos.length - 1));
  }
  lastDemoIdx = chosenDemoIdx;
  const chosenUrl = listOfDemos[chosenDemoIdx];
  urlInput.value = chosenUrl;
  img.src = chosenUrl;
}

// 4. apply option changes
function handleApplyChanges() {
  clearOldAnimation();
  toggleOptions();
  // fixme
}

/* ----- All necessary cancelAnimationFrame()'s ----- */
function clearOldAnimation() {
  // fixme
}

/* ----- Adjustable settings related ----- */
let numPixelsConstant; // fixme
let numBucketsConstant;
let numFramesConstant = 30;
let fillStyleConstant = "#13294f";

/* ----- When image is loaded, do this ----- */
img.addEventListener("load", onImageLoad);
const canvas = document.getElementById("canvas");

// state
let firstStart = true;
let width;
let height;
let ctx;
const colorMap = new Map();
let aniReq1;

function onImageLoad() {
  if (firstStart) showPlayButton();
  firstStart = false;

  width = canvas.width = img.width;
  height = canvas.height = img.height;

  addImgDimensionsToUI(width, height);
  animateProgBar(width * height);

  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // get pixel data
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  let highestBinCount = 0;
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
      totalNumFrames: Math.round(Math.random() * 120) + 30,
      currentFrameIdx: 0,
      destX: 0,
      destY: 0,
      color,
    });

    if (pixelInfo.length > highestBinCount) highestBinCount = pixelInfo.length;
  }

  console.log(colorMap);
  // calculate destX and destY for everything in colorMap
  colorMap.forEach((arr, key) => {
    const xOffset = key * width;

    arr.forEach((point, idx) => {
      point.destX = xOffset;
      point.destY = height - (height * idx) / highestBinCount;
    });
  });

  setTimeout(() => {
    aniReq1 = requestAnimationFrame(draw);
  }, 1000);
}

let currentStageIsImage = true; // true = image, false = histogram
let aniReq2;
let aniReq3;

function draw() {
  ctx.fillStyle = fillStyleConstant;
  ctx.fillRect(0, 0, width, height);
  
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  let hasMore = false;
  colorMap.forEach((arr) => {
    arr.forEach((point) => {
      const t = interpolate(point.currentFrameIdx / point.totalNumFrames);

      if (currentStageIsImage && point.currentFrameIdx < point.totalNumFrames) {
        point.currentFrameIdx++;
        hasMore = true;
      } else if (!currentStageIsImage && point.currentFrameIdx > 0) {
        point.currentFrameIdx--;
        hasMore = true;
        if (point.currentFrameIdx > 0) point.currentFrameIdx--;
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

/* ----- Capture stills and gifs related ----- */

// Capture stills
const snapSound = document.getElementById("snap-sound");
const stillsContainer = document.querySelector(".captured-stills-container");
const captureButton = document.querySelector(".capture-button");
captureButton.addEventListener("click", captureStill);

function captureStill() {
  snapSound.currentTime = 0;
  snapSound.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "Image histogram still");
  link.innerHTML = `<img src="${data}" alt ="Captured Still" />`;
  const encouragement = document.getElementById("encouragement");
  if (encouragement) encouragement.remove();
  stillsContainer.insertBefore(link, stillsContainer.firstChild);
}


/* ----- UI Related ----- */

// for transition to show play/pause button on firstStart
function showPlayButton() {
  document.querySelector(".top-menu").classList.add("show-play");
}

// image info displays
const progBarTotal = document.getElementById("prog-bar-total");
const imgDimensions = document.querySelector(".image-dimensions");
const imgTotalPixels = document.querySelector(".image-total-pixels");

function addImgDimensionsToUI(imgWidth, imgHeight) {
  const totalNumPixels = formatNumber(imgWidth * imgHeight);
  progBarTotal.textContent = totalNumPixels;
  imgDimensions.textContent = `${formatNumber(imgWidth)}px by ${formatNumber(imgHeight)}px`;
  imgTotalPixels.textContent = `${totalNumPixels} pixels total`;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// fake animation for prog bar before implementing gl
const progBarProcessed = document.getElementById("prog-bar-processed");
const progBarFilled = document.querySelector(".progress-bar-filled");

function animateProgBar(totalPixels) {
  let idx = 1;
  const constantInt = 60;
  const intId = setInterval(function () {
    progBarProcessed.textContent = formatNumber(
      Math.round((idx * totalPixels) / constantInt)
    );
    progBarFilled.style.width = idx / constantInt * 100 + "%";
    idx++;
    if (idx === constantInt + 1) clearInterval(intId);
  }, 1000 / constantInt);
}