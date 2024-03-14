
const formulario = document.querySelector(".formulario");
const galeriaImagenes = document.querySelector(".galeria-imagenes");

const OPENAI_API_KEY = "";

const generarImagenes = async (inputTextUsuario, cantidadImgUsuario) => {
    try {
        const respuesta = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                // model : "dall-e-3",
                prompt: inputTextUsuario,
                n: parseInt(cantidadImgUsuario),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error al generar imagenes!");
        }

        const {data} = await respuesta.json();
        console.log(data);

    } catch (error) {
        alert(error.message);
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    const inputTextUsuario = e.srcElement[0].value;
    const cantidadImgUsuario = e.srcElement[1].value;

    const imagen = Array.from(
        {length : cantidadImgUsuario}, () => `
        <div class="imagen">
            <img src="/src/assets/images/fondo.jpg" 
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

