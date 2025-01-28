// Tu API Key de OMDb
const API_KEY = "415ea282"; // Reemplaza con tu API Key

// Función para obtener los datos de la película/serie
async function getMovieDetails(imdbID) {
  try {
    // Hacer la solicitud a la API de OMDb
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    );

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Verificar si la respuesta es exitosa
    if (data.Response === "True") {
      console.log(data);
      // Extraer la URL del póster y la puntuación
      const posterUrl = data.Poster;
      const imdbRating = data.imdbRating;

      // Devolver los datos
      return { posterUrl, imdbRating };
    } else {
      // Si la respuesta no es exitosa, lanzar un error
      throw new Error(
        data.Error || "No se encontraron datos para el ID proporcionado."
      );
    }
  } catch (error) {
    // Manejar errores de red o de la API
    console.error("Error al obtener los datos:", error.message);
    return null;
  }
}

// Ejemplo de uso
const imdbID = "tt31019484"; // ID de IMDb de "Game of Thrones"
getMovieDetails(imdbID).then((result) => {
  if (result) {
    console.log("URL del póster:", result.posterUrl);
    console.log("Puntuación de IMDb:", result.imdbRating);
  }
});
