/* ----- Determine if mobile or big screen and handle resize & orientation change  ----- */
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
  stopCurrentAnimation();
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
  stopCurrentAnimation();
  toggleOptions();
  img.src = urlInputValue;
}

// 3. handle random image from demo button click
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
  stopCurrentAnimation();
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
  stopCurrentAnimation();
  toggleOptions();
  // fixme
}

/* ----- Adjustable settings related ----- */
let numPixelsConstant; // fixme
let numBucketsConstant;
let numFramesConstant = 30;
let fillStyleConstant = "#13294f";

/* ----- Animated related ----- */
img.addEventListener("load", onImageLoad);
const canvas = document.getElementById("canvas");

// capture video related
const recorder = new CanvasRecorder(canvas);
let videoRecordingComplete = false;
const videoButton = document.querySelector(".video-button");

// state
let firstStart = true;
let loopsCounter;
let width;
let height;
let ctx;
let colorMap;
let nextAnimationFrame;
let nextTimeout;

function onImageLoad() {
  if (firstStart) showPlayButton();
  firstStart = false;
  loopsCounter = 0;

  width = canvas.width = img.width;
  height = canvas.height = img.height;

  addImgDimensionsToUI(width, height);
  animateProgBar(width * height);

  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // get pixel data
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  colorMap = new Map();
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

  // console.log(colorMap);
  // calculate destX and destY for everything in colorMap
  colorMap.forEach((arr, key) => {
    const xOffset = key * width;

    arr.forEach((point, idx) => {
      point.destX = xOffset;
      point.destY = height - (height * idx) / highestBinCount;
    });
  });

  // start video recording
  recorder.start();
  videoButton.innerHTML = "<i class='fas fa-video'></i> Rec";
  recordingInt = setInterval(() => {
    if (videoButton.textContent.includes("...")) {
      videoButton.innerHTML = "<i class='fas fa-video'></i> Rec";
    } else {
      videoButton.innerHTML += ".";
    }
  }, 500);

  nextTimeout = setTimeout(() => {
    nextAnimationFrame = requestAnimationFrame(draw);
  }, 1000);
}

let currentStageIsImage = true; // true = image, false = histogram

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
    nextAnimationFrame = requestAnimationFrame(draw);
  } else {
    console.log("IN NOT HAVE MORE!!", currentStageIsImage);
    loopsCounter++;
    // end video recording
    if (loopsCounter === 2) {
      setTimeout(() => {
        recorder.stop();
        videoRecordingComplete = true;
        clearInterval(recordingInt);
        videoButton.innerHTML = "<i class='fas fa-download'></i> Video";
      }, 1200);
    }

    currentStageIsImage = !currentStageIsImage;
    nextTimeout = setTimeout(() => {
      nextAnimationFrame = requestAnimationFrame(draw);
    }, 1000);
  }
}

function interpolate(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return b * t + a * (1 - t);
}

/* ----- clear animation frames and timeouts ----- */
function stopCurrentAnimation() {
  cancelAnimationFrame(nextAnimationFrame);
  nextAnimationFrame = 0;
  clearTimeout(nextTimeout);
  nextTimeout = 0;
}

/* ----- start/pause animation toggle ----- */
const playPauseButton = document.querySelector(".play-button");
playPauseButton.addEventListener("click", togglePlayPause);

let isPaused = false;
function togglePlayPause() {
  if (isPaused) {
    nextAnimationFrame = requestAnimationFrame(draw);
    playPauseButton.innerHTML = "<i class='fas fa-pause'></i>";
  } else {
    stopCurrentAnimation();
    playPauseButton.innerHTML = "<i class='fas fa-play'></i>";
  }
  isPaused = !isPaused;
}

/* ----- Capture stills and video related ----- */
// Capture stills
const snapSound = document.getElementById("snap-sound");
const stillsContainer = document.querySelector(".captured-stills-container");
const captureButton = document.querySelector(".capture-button");
captureButton.addEventListener("click", captureStill);

function captureStill() {
  snapSound.currentTime = 0;
  snapSound.play();

  const data = canvas.toDataURL("image/jpeg");
  const newStill = document.createElement("a");
  newStill.href = data;
  newStill.setAttribute("download", "still_capture");
  newStill.innerHTML = `<img src="${data}" alt ="still_capture" />`;
  const encouragement = document.getElementById("encouragement2");
  if (encouragement) encouragement.remove();
  stillsContainer.insertBefore(newStill, stillsContainer.firstChild);
}

// Download video recording
videoButton.addEventListener("click", saveVideo);

function saveVideo() {
  if (videoRecordingComplete) recorder.save("video_recording.webm");
}

/* ----- UI Related ----- */
// for transition to show play/pause button on firstStart and get rid of text
function showPlayButton() {
  document.querySelector(".top-menu").classList.add("show-play");
  document.getElementById("encouragement1").remove();
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