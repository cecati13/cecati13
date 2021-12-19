bd_galery = [
    {
        name: "general",
        link: "../assets/galeria/img1.jpg",
        label: "todas",
        alt: "Aqui va la descripcion de las imágenes"
    },
    {
        name: "general",
        link: "../assets/galeria/img2.jpg",
        label: "todas",
        alt: "Esta es una prueba"
    },
    {
        name: "general",
        link: "../assets/galeria/img3.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img4.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img5.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img6.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img7.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img8.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img9.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img10.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img11.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img12.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img13.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img14.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img15.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img16.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img17.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img18.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img19.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img20.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img21.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img22.jpg",
        label: "todas",
        alt: ""
    },
    {
        name: "general",
        link: "../assets/galeria/img23.jpg",
        label: "todas",
        alt: ""
    }
];
const nodeGallery = document.querySelector("#gallery");

function createContainerImg (element) {    
    const imagen = document.createElement("img");
    imagen.src = element.link;
    imagen.alt = element.alt;

    //añadir cuando se una descripción de cada imagen
    // const figCaption = document.createElement("figcaption");
    // figCaption.textContent = element.name;

    const containerFigure = document.createElement("figure");
    containerFigure.append(imagen, 
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