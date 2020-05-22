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
