// state
const colorMap = new Map();
let currentStage = "image"; // "histogram"
let ctx;
let highestBinCount = 0;
let width;
let height;
let urlInputValue;

const img = new Image();
img.crossOrigin = "Anonymous";


// 1. handle local file upload
const inputTypeFile = document.getElementById("local-file");
inputTypeFile.addEventListener("change", handleLocalFile);

function handleLocalFile(e) {
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
  img.src = urlInputValue;
}
function handleUrlInputChange(e) {
  urlInputValue = e.currentTarget.value;
}

// 3. When image is loaded, do this
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
      x: Math.floor(i / 1200),
      y: Math.floor((i % 1200) / 4),
      duration: Math.round(Math.random() * 120) + 30,
      frame: 0,
      destX: 0,
      destY: 0,
      color,
    });

    // find the highest bin
    if (pixelInfo.length > highestBinCount) highestBinCount = pixelInfo.length;
  }

  console.log(colorMap);
}
