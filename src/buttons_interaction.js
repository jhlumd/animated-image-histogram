// Resize, orientation change => collapse options if we go from big screen to small screen
const topSection = document.querySelector(".top-section");

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

let isSmallScreen = false;
const onResize = debounce(function () {
  if (window.innerWidth <= 819 && !isSmallScreen) {
    isSmallScreen = true;
    topSection.classList.add("collapsed");
  }
}, 250);

onResize();
window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", onResize);

// 

const optionsButton = document.querySelector(".options-button");
optionsButton.addEventListener("click", toggleOptions);

function toggleOptions() {
  topSection.classList.toggle("collapsed");
  if (topSection.classList.contains("collapsed")) {
    optionsButton.innerHTML = "<i class='fas fa-sliders-h'></i> Options";
  } else {
    optionsButton.innerHTML = "<i class='fas fa-sliders-h'></i> Hide Options";
  }
}