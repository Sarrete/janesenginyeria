document.addEventListener("DOMContentLoaded", function() {
    // Selecciona los elementos de los piñones y el menú
    const leftGear = document.querySelector(".gears-left");
    const rightGear = document.querySelector(".gears-right");
    const menuIcon = document.getElementById("menu-icon");
    const menu = document.getElementById("menu");
    const popup = document.getElementById("popup");
    const popupContent = document.querySelector(".popup-content");
    const closePopup = document.getElementById("close-popup");
    const popupImage = document.getElementById("popup-image");
    const popupCaption = document.getElementById("popup-caption");
    const popupVideo = document.getElementById("popup-video");
    const videoSource = document.getElementById("popup-video-source");
    const videoCaption = document.getElementById("popup-video-caption");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const languageIcon = document.getElementById('language-icon');
    const languageSelector = document.getElementById('language-selector');
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');

    let currentMediaIndex = 0;
    let currentMedia = [];
    let isVideo = false;

    // Mostrar el selector al hacer clic en el icono
    languageIcon.addEventListener('click', function() {
        languageSelector.style.display = 'block';
    });

    // Ocultar el selector al elegir un idioma
    languageSelector.addEventListener('change', function() {
        languageSelector.style.display = 'none';
    });

    // Función para cargar el archivo de traducción
const loadTranslations = (lang) => {
    fetch(`../locales/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[key]) {
                    element.innerHTML = translations[key]; // Cambiado de textContent a innerHTML
                }
            });
        })
        .catch(error => console.error('Error loading translations:', error));
};


    // Cambiar idioma al seleccionar una opción
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        loadTranslations(selectedLanguage);
    });

    // Cargar el idioma por defecto (catalán)
    loadTranslations('ca');

    // Función para rotar los piñones en función del desplazamiento vertical (scroll)
    function rotateGears() {
        const rotation = window.scrollY / 5; // Controla la velocidad del giro
        if (leftGear && rightGear) {
            rightGear.style.transform = `rotate(${rotation}deg)`;
            leftGear.style.transform = `rotate(-${rotation}deg)`; // Gira en sentido contrario
        }
    }

    // Animación de piñones al cargar la página
    setTimeout(() => {
        if (leftGear && rightGear) {
            leftGear.classList.add('gear-animate');
            rightGear.classList.add('gear-animate');
        }
    }, 100);

    // Escuchar el evento de scroll para animar los piñones
    window.addEventListener("scroll", function() {
        rotateGears();
    });

    // Mostrar el menú al hacer clic sobre el icono
    if (menuIcon && menu) {
        menuIcon.addEventListener("click", function() {
            menu.classList.toggle("show");
        });
    }

    // Cerrar el menú al seleccionar un enlace y desplazarse suavemente
    const menuLinks = menu ? menu.querySelectorAll("a") : [];
    menuLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto
            const targetId = this.getAttribute("href"); // Obtener el ID del objetivo
            const targetElement = document.querySelector(targetId); // Seleccionar el elemento objetivo

            // Desplazarse suavemente hacia el elemento
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Restar el alto del encabezado
                behavior: "smooth" // Efecto de desplazamiento suave
            });

            menu.classList.remove("show"); // Ocultar el menú
        });
    });

    const imageContainers = document.querySelectorAll(".image-container");

    imageContainers.forEach(container => {
        const img = container.querySelector("img");
        const caption = container.querySelector(".image-caption");
        const images = JSON.parse(container.getAttribute("data-images"));
        const videoSrc = container.getAttribute("data-video");

        img.addEventListener("click", function() {
            // Si hay video, lo agregamos como primer elemento del array de medios
            currentMedia = videoSrc ? [videoSrc].concat(images) : images;
            currentMediaIndex = 0;  // Comenzar con el primer elemento
            isVideo = !!videoSrc;   // Verificar si es un video o no
            showMedia(currentMediaIndex, caption.textContent);
        });
    });

    function showMedia(index, captionText) {
        popupCaption.textContent = captionText;
        videoSource.src = ''; // Limpiar la fuente del video antes de mostrar
        videoCaption.style.display = 'none'; // Ocultar descripción del video
        popup.style.display = "flex";

        if (index === 0 && isVideo) {
            // Mostrar el video
            popupImage.style.display = "none";  // Ocultar la imagen
            popupVideo.style.display = "block";  // Mostrar el video
            videoSource.src = currentMedia[index];
            popupVideo.load(); // Cargar el nuevo video
            videoCaption.textContent = captionText; // Mostrar descripción del video
            videoCaption.style.display = 'block'; // Mostrar la descripción
        } else {
            // Mostrar imagen
            popupVideo.style.display = "none";  // Ocultar el video
            popupImage.src = currentMedia[index];
            popupImage.style.display = "block";  // Mostrar la imagen
            popupCaption.textContent = captionText; // Mostrar descripción de la imagen
        }
    }

    prevBtn.addEventListener("click", function() {
        currentMediaIndex = (currentMediaIndex === 0) ? currentMedia.length - 1 : currentMediaIndex - 1;
        showMedia(currentMediaIndex, popupCaption.textContent);
    });

    nextBtn.addEventListener("click", function() {
        currentMediaIndex = (currentMediaIndex === currentMedia.length - 1) ? 0 : currentMediaIndex + 1;
        showMedia(currentMediaIndex, popupCaption.textContent);
    });

    closePopup.addEventListener("click", function() {
        popup.style.display = "none";
        popupVideo.pause();  // Detener el video cuando se cierra el popup
        videoSource.src = ''; // Limpiar la fuente del video
    });

    popup.addEventListener("click", function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
            popupVideo.pause();  // Detener el video cuando se cierra el popup
            videoSource.src = ''; // Limpiar la fuente del video
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Cargar reseñas aprobadas desde la función Netlify
    fetch('/.functions/submitReview')
        .then(response => response.json())
        .then(reviews => {
            const container = document.getElementById('approved-reviews-container');
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review');
                reviewDiv.innerHTML = `
                    <h3>${review.name}</h3>
                    <p>Calificación: ${'⭐'.repeat(review.rating)}</p>
                    <p>${review.comment}</p>
                `;
                if (review.photo) {
                    const img = document.createElement('img');
                    img.src = review.photo;
                    img.alt = 'Foto de la reseña';
                    img.style.maxWidth = '200px';
                    reviewDiv.appendChild(img);
                }
                container.appendChild(reviewDiv);
            });
        })
        .catch(error => console.error('Error al cargar reseñas:', error));
});

// Manejo del envío del formulario de reseña
document.getElementById('review-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="stars"]:checked')?.value || 'No rating';
    const comment = document.getElementById('comment').value;
    const photo = document.getElementById('photo').files[0];

    // Si hay foto, convertirla a base64
    let photoData = null;
    if (photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
            photoData = reader.result;
            sendReview(); // Enviar la reseña después de cargar la foto
        };
        reader.readAsDataURL(photo);
    } else {
        sendReview();
    }

    function sendReview() {
        fetch('/.functions/submitReview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rating, comment, photo: photoData }),
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error al enviar la reseña:', error));
    }
});
