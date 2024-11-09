const fs = require('fs');
const path = require('path');

const reviewsFile = path.resolve(__dirname, 'reviews.json');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        let reviews = [];

        // Leer las reseñas existentes
        if (fs.existsSync(reviewsFile)) {
            const existingData = fs.readFileSync(reviewsFile);
            reviews = JSON.parse(existingData);
        }

        // Agregar la nueva reseña al JSON
        reviews.push({
            name: data.name,
            rating: data.rating,
            comment: data.comment,
            photo: data.photo || null, // Si no se envía la foto, se guarda como null
            approved: false, // Pendiente de aprobación
        });

        // Guardar el archivo actualizado
        fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Reseña recibida y pendiente de aprobación" }),
        };
    }

    // Ver reseñas aprobadas
    if (event.httpMethod === 'GET') {
        if (fs.existsSync(reviewsFile)) {
            const data = fs.readFileSync(reviewsFile);
            const approvedReviews = JSON.parse(data).filter(review => review.approved);
            return {
                statusCode: 200,
                body: JSON.stringify(approvedReviews),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify([]),
        };
    }

    return {
        statusCode: 405,
        body: "Método no permitido",
    };
};
