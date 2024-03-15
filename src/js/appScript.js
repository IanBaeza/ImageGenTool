const apiURL = "https://api.openai.com/v1/images/generations";
const OPENAI_API_KEY = "";

const formulario = document.querySelector(".formulario");
const galeriaImagenes = document.querySelector(".galeria-imagenes");

let estaGenerandoImagen = false;

const actualizarImagen = (arrayImagenes) => {
    arrayImagenes.forEach((objImagen, indice) => {
        const imagen = galeriaImagenes.querySelectorAll(".imagen")[indice];
        const imagenElement = imagen.querySelector("img");
        const btnDescargar = imagen.querySelector(".btn-descargar");

        const iaGeneratedImg = `data:image/jpeg;base64,${objImagen.b64_json}`;
        imagenElement.src = iaGeneratedImg;

        imagenElement.onload = () => {
            imagen.classList.remove("cargando");
            btnDescargar.setAttribute("href", iaGeneratedImg);
            btnDescargar.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generarImagenes = async (inputTextUsuario, cantidadImgUsuario) => {
    try {
        const respuesta = await fetch( apiURL, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${OPENAI_API_KEY}`
            },
            body : JSON.stringify({
                prompt : inputTextUsuario,
                n : parseInt(cantidadImgUsuario),
                size : "512x512",
                response_format : "b64_json"
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error al generar imagenes!");
        }

        const { data } = await respuesta.json();
        console.log(data);
        actualizarImagen([...data]);

    } catch (error) {
        alert(error.message);
    } finally {
        estaGenerandoImagen = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    if(estaGenerandoImagen) return;
    estaGenerandoImagen = true;

    const inputTextUsuario = e.srcElement[0].value;
    const cantidadImgUsuario = e.srcElement[1].value;

    const imagen = Array.from(
        {length : cantidadImgUsuario}, () => `
        <div class="imagen cargando">
            <img src="/src/assets/images/loader.svg" 
                alt="imagen">

            <a href="#" class="btn-descargar">
                <img src="/src/assets/images/icono-descargar.png" 
                    alt="icono-descargar">
            </a>
        </div>`
    ).join("");

    galeriaImagenes.innerHTML = imagen;
    generarImagenes(inputTextUsuario, cantidadImgUsuario);
}

formulario.addEventListener("submit", handleFormSubmission);

