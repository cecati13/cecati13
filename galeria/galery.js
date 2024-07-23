import { IMAGES } from "./../shared/images.js";
const URL_BASE_IMAGE = "https://storage.googleapis.com/cecati13/galeria/";
const container = document.querySelector(".carousel__list");

const functionGlider = () => {
  new Glider(container, {
    type: "carousel",
    dots: ".carousel__indicators",
    arrows: {
      prev: ".carousel__previous",
      next: ".carousel__next",
    },
  });
};

function galleryContainer(array) {
  const arrayContainer = [];
  array.forEach((element) => {
    const picture = document.createElement("div");
    picture.innerHTML = `
        <picture class="container__picture">
            <source srcset="${
              URL_BASE_IMAGE + element.imageSmall
            }" media="(max-width: 767px)">
            <source srcset="${
              URL_BASE_IMAGE + element.imageMedium
            }" media="(max-width: 1023px)">
            <img srcset="${URL_BASE_IMAGE + element.imageHigh}" media="100%"
            alt="${element.nombre}" class="gallery__img">        
        </picture>
        `;
    arrayContainer.push(picture);
  });
  container.append(...arrayContainer);
  window.addEventListener("load", functionGlider());
}

galleryContainer(IMAGES.mockAPI);
