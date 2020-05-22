(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = [
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
},{}],2:[function(require,module,exports){
/* ----- handle resize & orientation change first  ----- */
const topSection = document.querySelector(".top-section");

let isSmallScreen = false;
function handleResize() {
  if (window.innerWidth < 820 && !isSmallScreen) {
    isSmallScreen = true;
    topSection.classList.add("collapsed");
  } else if (window.innerWidth > 819) {
    isSmallScreen = false;
    topSection.classList.remove("collapsed"); // not necessary b/c of css media queries
  }
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

handleResize();
const debouncedHandleResize = debounce(handleResize, 250);
window.addEventListener("resize", debouncedHandleResize);
window.addEventListener("orientationchange", debouncedHandleResize);

/* ----- Mobile only ----- */
// Clicking options button toggles options menu
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
// Also collapse options on local file, url submit, demo, apply changes below
// with image input handlers


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
const listOfDemos = require("./demo_urls");
const demoButton = document.querySelector(".demo-button");
demoButton.addEventListener("click", onDemoClick);

let lastDemoIdx;
function onDemoClick() {
  clearOldAnimation();
  toggleOptions();
  let chosenIdx;
  while (chosenIdx === lastDemoIdx) {
    chosenIdx = Math.floor(Math.random() * (listOfDemos.length - 1));
  }
  lastDemoIdx = chosenIdx;
  const chosenUrl = listOfDemos[chosenIdx];
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
},{"./demo_urls":1}]},{},[2]);
