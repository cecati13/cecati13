bd_galery = [
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img1.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img2.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img3.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img4.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img5.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img6.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img7.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img8.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img9.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img10.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img11.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img12.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img13.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img14.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img15.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img16.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img17.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img18.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img19.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img20.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img21.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img22.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "https://cecati13web.blob.core.windows.net/galeria/img23.jpg",
        label: "todas",
        alt: ""
    }
];
const nodeGallery = document.querySelector("#nodeGallery");

function createContainerImg (element) {    
    const imagen = document.createElement("img");
    imagen.src = element.link;
    imagen.alt = element.alt;

    //añadir cuando se una descripción de cada imagen
    //const figCaption = document.createElement("figcaption");
    //figCaption.textContent = element.name;

    const containerFigure = document.createElement("figure");
    containerFigure.append(imagen, 
        //añadir cuando se tenga descripcion de la imagen
      //figCaption
        );
    return containerFigure;
}

function galleryContainer (array) {
    const container = document.createElement("div");
    container.className = "container__gallery";
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const figure = createContainerImg(element);
        container.appendChild(figure);
    }
    return container
}

const containerImages = galleryContainer(bd_galery);
nodeGallery.appendChild(containerImages);