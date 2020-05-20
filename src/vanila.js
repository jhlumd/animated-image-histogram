// Resize, orientation change
const topSection = document.querySelector(".top-section");

function onResize() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight / 100}px`
  );

  if (window.innerWidth <= 800) {
    topSection.classList.add("collapsed");
  }
}

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", onResize);
onResize();

const optionsButton = document.querySelector(".options-button");
optionsButton.addEventListener("click", toggleOptions);

function toggleOptions() {

}