/* -- Resize, orientation change => collapse options if we go from big screen
to small screen -- */

const topSection = document.querySelector(".top-section");
let isSmallScreen = false;

function onResize() {
  if (window.innerWidth <= 819 && !isSmallScreen) {
    isSmallScreen = true;
    topSection.classList.add("collapsed");
  } else if (window.innerWidth > 819) {
    isSmallScreen = false;
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

const dbcOnResize = debounce(onResize, 250);

onResize();
window.addEventListener("resize", dbcOnResize);
window.addEventListener("orientationchange", dbcOnResize);

/* -- Clicking options button toggles options menu -- */

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

/* -- Also collapse options on submit, clicking apply changes, demo, file -- */
const imageLinkForm = document.getElementById("image-link-form");
imageLinkForm.addEventListener("submit", toggleOptions);