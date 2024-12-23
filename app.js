document.getElementById("submit-review").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener datos del formulario
  const name = document.getElementById("name").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  // Simular guardar la valoración en un archivo JSON
  const newReview = { name, rating, comment, approved: false };

  // Guardar en el servidor usando Netlify Functions o localmente
  fetch('netlify/functions/save-review.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newReview),
  })
    .then((response) => {
      console.log('response: '+Json.stringify(response));
      response.json();
  })
    .then((data) => {
      alert("¡Valoración enviada para revisión!");
      document.getElementById("submit-review").reset();
      loadPendingReviews();
    })
    .catch((error) => {
      console.error("Error al guardar la valoración:", error);
    });
});

// Cargar valoraciones pendientes (simulación)
function loadPendingReviews() {
  fetch('/functions/reviews.json')
    .then((response) => response.json())
    .then((reviews) => {
      const reviewsList = document.getElementById("reviews-list");
      reviewsList.innerHTML = "";

      reviews
        .filter((review) => !review.approved)
        .forEach((review, index) => {
          const reviewDiv = document.createElement("div");
          reviewDiv.innerHTML = `
            <p><strong>${review.name}</strong> (${review.rating} estrellas)</p>
            <p>${review.comment}</p>
            <button onclick="approveReview(${index})">Aprobar</button>
          `;
          reviewsList.appendChild(reviewDiv);
        });
    })
    .catch((error) => console.error("Error al cargar las valoraciones:", error));
}

// Aprobar valoración (simulación)
function approveReview(index) {
  fetch('/netlify/functions/approve-review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ index }),
  })
    .then(() => {
      alert("¡Valoración aprobada!");
      loadPendingReviews();
    })
    .catch((error) => console.error("Error al aprobar la valoración:", error));
}

// Inicializar
loadPendingReviews();

const saveReview = (review) => {
  fetch('/netlify/functions/save-review', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al guardar la valoración');
          }
          return response.json();
      })
      .then(data => {
          console.log('Valoración guardada:', data);
      })
      .catch(error => {
          console.error('Error al guardar la valoración:', error);
      });
};
