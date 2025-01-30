import apiService from "../js/apiService.js";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const observerTarget = document.querySelector(".observer-target");

form.addEventListener("submit", onSearch);

const observer = new IntersectionObserver(onLoadMore, {
  root: null,
  rootMargin: "200px",
  threshold: 1.0,
});

async function onSearch(event) {
  event.preventDefault();
  apiService.query = event.currentTarget.elements.query.value.trim();
  if (!apiService.query) return;

  apiService.resetPage();
  clearGallery();
  await fetchAndRenderImages();
}

async function onLoadMore(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting && apiService.query) {
      await fetchAndRenderImages();
    }
  }
}

async function fetchAndRenderImages() {
  try {
    const data = await apiService.fetchImages();
    if (!data.hits.length) throw new Error("No images found");
    renderGallery(data.hits);
    apiService.incrementPage();
  } catch (error) {
    console.error("Error loading images:", error.message);
  }
}

function renderGallery(images) {
  const markup = images
    .map((image) => {
      const { webformatURL, largeImageURL, likes, views, comments, downloads } =
        image;

      return `
        <li class="photo-card">
          <a href="${largeImageURL}" target="_blank">
            <img src="${webformatURL}" alt="Image" />
          </a>
          <div class="stats">
            <p class="stats-item">
              <i class="material-icons">thumb_up</i>${likes}
            </p>
            <p class="stats-item">
              <i class="material-icons">visibility</i>${views}
            </p>
            <p class="stats-item">
              <i class="material-icons">comment</i>${comments}
            </p>
            <p class="stats-item">
              <i class="material-icons">cloud_download</i>${downloads}
            </p>
          </div>
        </li>
      `;
    })
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
  observer.observe(observerTarget);
}

function clearGallery() {
  gallery.innerHTML = "";
}
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    fetchAndRenderImages();
  }
});