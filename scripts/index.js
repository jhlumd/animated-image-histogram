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
// 1) local file (file input and drag/drop)
// 2) url input
// 3) demo
// 4) apply with new options

// 1. handle local file upload
const inputTypeFile = document.getElementById("local-file");
inputTypeFile.addEventListener("change", handleLocalFile);

function handleLocalFile(e) {
  toggleOptions();
  stopCurrentAnimation();
  stopVideoRecording();

  const file = e.currentTarget.files[0];
  img.src = window.URL.createObjectURL(file);
}

// local file with dragover
const pageWrapper = document.getElementById("page-wrapper");
pageWrapper.addEventListener("dragover", handleDragOver);
const modal = document.querySelector(".modal");
modal.addEventListener("drop", handleDrop);
modal.addEventListener("dragleave", handleDragLeave);
const modalText = document.querySelector(".modal-text");

function handleDragOver(e) {
  e.preventDefault();
  modalText.textContent = "Drop your file anywhere";
  modal.classList.add("show");
}

function handleDragLeave(e) {
  e.preventDefault();
  modal.classList.remove("show");
}

function handleDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.items[0].getAsFile();
  if (file) {
    if (file.type.includes("image")) {
      modal.classList.remove("show");
      img.src = window.URL.createObjectURL(file);
    } else {
      modalText.textContent = "Please choose an image file";
    }
  } else {
    modalText.textContent = "Please choose an image file";
  }
}

modal.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.remove("show");
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
  toggleOptions();
  stopCurrentAnimation();
  stopVideoRecording();

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
const demoText = document.querySelector(".demo-text");
demoButton.addEventListener("click", onDemoClick);
demoText.addEventListener("click", onDemoClick);

let lastDemoIdx;
let chosenDemoIdx;
function onDemoClick() {
  if (!topSection.classList.contains("collapsed")) toggleOptions();
  stopCurrentAnimation();
  stopVideoRecording();

  while (chosenDemoIdx === lastDemoIdx) {
    chosenDemoIdx = Math.floor(Math.random() * (listOfDemos.length - 1));
  }
  lastDemoIdx = chosenDemoIdx;
  const chosenUrl = listOfDemos[chosenDemoIdx];
  urlInput.value = chosenUrl;
  img.src = chosenUrl;
}

// 4. apply option changes
const applyChangesButton = document.querySelector(".apply-button");
applyChangesButton.addEventListener("click", handleApplyChanges);

function handleApplyChanges() {
  toggleOptions();
  stopCurrentAnimation();
  stopVideoRecording();

  onImageLoad();
}

/* ----- Adjustable settings related ----- */
// defaults
let numPixelsLimit = 200000; // min: 500, default: 200000, max: 250000, incre: 1
let numBuckets = 500; // min: 2, default: 500, max: 510, incre: 1
let inputSeconds = 5.75; // min: 2.25, default: 5.75, max: 60, incre: 0.25
let chosenBgColor = "#2A2D31";

// -- Max num pixels setting
const maxPixelsBar = document.querySelector(".max-pixels");
const maxPixelsBarFilled = document.querySelector(".max-pixels-filled");
maxPixelsBar.addEventListener("click", handleNewMaxPixels);

function handleNewMaxPixels(e) {
  const ratio = e.offsetX / maxPixelsBar.offsetWidth;  
  maxPixelsBarFilled.style.width = `${ratio * 100}%`;
  const max = 250000;
  const min = 500;
  numPixelsLimit = Math.round(ratio * (max - min) + min);
  maxPixelsBarFilled.textContent = formatNumber(numPixelsLimit);
}

// -- Num buckets setting
const numBucketsBar = document.querySelector(".num-buckets");
const numBucketsBarFilled = document.querySelector(".num-buckets-filled");
numBucketsBar.addEventListener("click", handleNewNumBuckets);

function handleNewNumBuckets(e) {
  const ratio = e.offsetX / numBucketsBar.offsetWidth;
  numBucketsBarFilled.style.width = `${ratio * 100}%`;
  const max = 510;
  const min = 2;
  numBuckets = Math.round(ratio * (max - min) + min);
  numBucketsBarFilled.textContent = numBuckets;
}

// -- Duration setting
const durationBar = document.querySelector(".duration");
const durationBarFilled = document.querySelector(".duration-filled");
durationBar.addEventListener("click", handleNewDuration);

function handleNewDuration(e) {
  const ratio = e.offsetX / durationBar.offsetWidth;
  durationBarFilled.style.width = `${ratio * 100}%`;
  const max = 60;
  const min = 2.25;
  inputSeconds = ratio * (max - min) + min;
  durationBarFilled.textContent = inputSeconds.toFixed(2) + "s";
}
// let numFramesInTens = (inputSeconds - 2) * 4;
// let numFramesConstant = Math.floor(numFramesInTens) * 8;

// -- Background color setting
const bgColors = document.querySelector(".bg-colors");
bgColors.addEventListener("click", handleBgColorChange);
let lastSelectedColorElement = document.querySelector(".bg-color-item");

function handleBgColorChange(e) {
  lastSelectedColorElement.classList.remove("color-selected");
  lastSelectedColorElement = e.target;
  lastSelectedColorElement.classList.add("color-selected");

  switch (lastSelectedColorElement.title) {
    case "gray":
      chosenBgColor = "#2A2D31";
      break;
    case "light-blue":
      chosenBgColor = "#9ABDDE";
      break;
    case "teal":
      chosenBgColor = "#51A2A7";
      break;
    case "navy":
      chosenBgColor = "#13294f";
      break;
    case "yellow":
      chosenBgColor = "#F2AD52";
      break;
    case "pink":
      chosenBgColor = "#E99E9B";
      break;
    case "white":
      chosenBgColor = "#FFFFFF";
      break;
    case "light-gray":
      chosenBgColor = "#E7E7E7";
      break;
    case "black":
      chosenBgColor = "#000000";
      break;
    case "brown":
      chosenBgColor = "#664948";
      break;
    case "orange":
      chosenBgColor = "#EC694D";
      break;
    case "red":
      chosenBgColor = "#BF3558";
      break;
    default:
      chosenBgColor = "#2A2D31";
      break;
  }
}

/* ----------------          Actual animation logic          ---------------- */
img.addEventListener("load", onImageLoad);
const canvas = document.getElementById("canvas");

// capture video related
const recorder = new CanvasRecorder(canvas);
let videoRecordingComplete = false;
const videoButton = document.querySelector(".video-button");

// animation state
let firstStart = true;
let loopsCounter;
let width;
let height;
let ctx;
let colorMap;
let nextAnimationFrame;
let nextTimeout;
let videoIsRecording = false;
let wasScaledDown = false;

const canvasSection = document.querySelector(".canvas-section");

function onImageLoad() {
  if (firstStart) showPlayButton();
  firstStart = false;
  loopsCounter = 0;

  addImgDimensionsToUI(img.width, img.height);

  // scale down to pixel limit (for performance and for adjustable settings)
  const widthHeightRatio = img.width / img.height;
  if (img.width * img.height > numPixelsLimit) {
    width = Math.round(Math.sqrt(numPixelsLimit * widthHeightRatio));
    height = Math.round(numPixelsLimit / width);
    wasScaledDown = true;
  } else {
    width = img.width;
    height = img.height;
  }

  // check if the canvas section is big enough on desktop and on mobile
  let widthAvailable;
  let heightAvailable;
  if (window.innerWidth > 819) {
    widthAvailable = canvasSection.offsetWidth - 40;
    heightAvailable = canvasSection.offsetHeight - 40;

    if (widthAvailable < width || heightAvailable < height) {
      if (widthAvailable < width && heightAvailable < height) {
        if (width - widthAvailable > height - heightAvailable) {
          width = widthAvailable;
          height = width / widthHeightRatio;
        } else {
          height = heightAvailable;
          width = height / widthHeightRatio;
        }
      } else if (widthAvailable < width && heightAvailable >= height) {
        width = widthAvailable;
        height = width / widthHeightRatio;
      } else {
        height = heightAvailable;
        width = height / widthHeightRatio;
      }
    }
  } else {
    widthAvailable = window.innerWidth;
    heightAvailable = window.innerHeight - 160;

    if (widthAvailable < width || heightAvailable < height) {
      if (widthAvailable < width && heightAvailable < height) {
        if (width - widthAvailable > height - heightAvailable) {
          width = widthAvailable;
          height = width / widthHeightRatio;
        } else {
          height = heightAvailable;
          width = height / widthHeightRatio;
        }
      } else if (widthAvailable < width && heightAvailable >= height) {
        width = widthAvailable;
        height = width / widthHeightRatio;
      } else {
        height = heightAvailable;
        width = height / widthHeightRatio;
      }
    }
  }

  animateProgBar(width * height);
  
  canvas.width = width;
  canvas.height = height;
  

  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height); // important

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
    // fixme: set custom buckets by dividing lightness more widely



    let pixelInfo = colorMap.get(lightness);

    if (!pixelInfo) {
      pixelInfo = [];
      colorMap.set(lightness, pixelInfo);
    }

    pixelInfo.push({
      x: Math.floor((i % (width * 4)) / 4),
      y: Math.floor(i / (width * 4)),
      totalNumFrames:
        Math.round(Math.random() * (Math.floor((inputSeconds - 2) * 4) * 8)) +
        (Math.floor((inputSeconds - 2) * 4) * 2),
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

  // start video recording
  recorder.start();
  videoIsRecording = true;
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
  ctx.fillStyle = chosenBgColor;
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
  ctx.putImageData(imgData, 0, 0); // important

  if (hasMore) {
    // console.log("hasMore = true", currentStageIsImage);
    nextAnimationFrame = requestAnimationFrame(draw);
  } else {
    // console.log("hasMore = false", currentStageIsImage);
    loopsCounter++;
    // end video recording
    if (loopsCounter === 2) setTimeout(stopVideoRecording, 1100);

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
const muteButton = document.querySelector(".mute-button");
muteButton.addEventListener("click", toggleMute);
let soundMuted = false;

function captureStill() {
  if (!soundMuted) {
    snapSound.currentTime = 0;
    snapSound.play();
  }

  const data = canvas.toDataURL("image/jpeg");
  const newStill = document.createElement("a");
  newStill.href = data;
  newStill.setAttribute("download", "still_capture");
  newStill.innerHTML = `<img src="${data}" alt ="still_capture" />`;
  const encouragement = document.getElementById("encouragement2");
  if (encouragement) encouragement.remove();
  stillsContainer.insertBefore(newStill, stillsContainer.firstChild);
}

function toggleMute(e) {
  e.stopPropagation();
  if (soundMuted) {
    muteButton.innerHTML = "<i class='fas fa-volume-up'></i>";
  } else {
    muteButton.innerHTML = "<i class='fas fa-volume-mute'></i>";
  }
  soundMuted = !soundMuted;
}

// Download video recording
videoButton.addEventListener("click", saveVideo);

function saveVideo() {
  if (videoRecordingComplete) recorder.save("video_recording.webm");
}

// Stop current video recording
function stopVideoRecording() {
  if (!videoIsRecording) return;
  recorder.stop();
  videoRecordingComplete = true;
  videoIsRecording = false;
  // console.log(recordingInt); // fixme recording bugs
  clearInterval(recordingInt);
  videoButton.innerHTML = "<i class='fas fa-download'></i> Video";
}

/* ----- UI Related ----- */
// for transition to show play/pause button on firstStart and get rid of text
function showPlayButton() {
  document.querySelector(".top-menu").classList.add("show-play");
  document.getElementById("encouragement1").remove();
}

// image info displays
const imgDimensions = document.querySelector(".image-dimensions");
const imgTotalPixels = document.querySelector(".image-total-pixels");

function addImgDimensionsToUI(imgWidth, imgHeight) {
  const totalNumPixels = formatNumber(imgWidth * imgHeight);
  imgDimensions.textContent = `${formatNumber(imgWidth)}px by ${formatNumber(imgHeight)}px`;
  imgTotalPixels.textContent = `${totalNumPixels} pixels total`;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// fake animation for prog bar before implementing gl
const scaledInfo = document.getElementById("scaled-info");
const progBarProcessed = document.getElementById("prog-bar-processed");
const progBarFilled = document.querySelector(".progress-bar-filled");

function animateProgBar(totalPixels) {
  if (wasScaledDown) {
    const percentage = Math.round((width / img.width) * 100);
    scaledInfo.textContent = `(scale: ${percentage}%)`;
  }
  let idx = 1;
  const constantInt = 30;
  const intId = setInterval(function () {
    progBarProcessed.textContent = `${formatNumber(
      Math.round((idx * totalPixels) / constantInt)
    )} pixels processed`;
    progBarFilled.style.width = idx / constantInt * 100 + "%";
    idx++;
    if (idx === constantInt + 1) clearInterval(intId);
  }, 1000 / constantInt);
}