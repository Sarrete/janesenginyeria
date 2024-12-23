
exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        try {
            const data = JSON.parse(event.body); // Parseamos los datos enviados desde el cliente
            console.log("Datos recibidos:", data);

            // Aquí agregarías lógica para guardar los datos, por ejemplo, en un archivo JSON

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Valoración guardada correctamente" })
            };
        } catch (error) {
            console.error("Error al guardar la valoración:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error al guardar la valoración" })
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método no permitido" })
        };
    }
};
