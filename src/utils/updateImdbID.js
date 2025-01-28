const { Client } = require("@notionhq/client");
const axios = require("axios");

// Configuración de Notion
const notion = new Client({
  auth: "secret_C1tboghM2jDVp1Sr41ono0V37XRvXcbG0jOlilifCoF",
});
const databaseId = "64143e7030654d14ab5c213a78ec0634";

// Configuración de OMDb
const OMDB_API_KEY = "415ea282"; // Reemplaza con tu API Key de OMDb

// Función para obtener la calificación de IMDb usando OMDb
async function getIMDbRating(imdbID) {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`
    );
    const data = response.data;

    if (data.Response === "True") {
      return data.imdbRating; // Devuelve la calificación de IMDb
    } else {
      console.error(
        `Error al obtener datos de IMDb para ${imdbID}:`,
        data.Error
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Error en la solicitud a OMDb para ${imdbID}:`,
      error.message
    );
    return null;
  }
}

// Función para actualizar el campo "imdb" en Notion (Rich Text)
async function updateNotionPage(pageId, imdbRating, titulo) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        IMDB: {
          rich_text: [
            {
              type: "text",
              text: {
                content: imdbRating || "N/A", // La calificación como texto (o "N/A" si es null)
              },
            },
          ],
        },
      },
    });
    console.log(
      `Página de ${titulo} actualizada con IMDb rating: ${imdbRating || "N/A"}`
    );
  } catch (error) {
    console.error(`Error al actualizar la página ${pageId}:`, error.message);
  }
}

// Función principal
async function handlerCalendarioSeries() {
  try {
    // Obtener las series desde Notion
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "FechaInicio",
            date: {
              is_not_empty: true,
            },
          },
          {
            property: "FechaInicio",
            date: {
              after: "2025-01-06",
            },
          },
          {
            property: "FechaInicio",
            date: {
              before: "2025-01-27",
            },
          },
          {
            property: "Latam",
            select: {
              does_not_equal: "Crunchyroll", // Excluye Crunchyroll
            },
          },
        ],
      },
      sorts: [
        {
          property: "FechaInicio",
          direction: "ascending",
        },
        {
          property: "Título",
          direction: "ascending",
        },
      ],
    });

    // Procesar cada serie
    for (const serie of response.results) {
      const imdbID = serie.properties.IDimdb?.rich_text[0]?.plain_text; // Asegúrate de que el campo IMDb_ID exista en tu base de datos
      if (imdbID) {
        // Obtener la calificación de IMDb
        const imdbRating = await getIMDbRating(imdbID);

        // Actualizar el campo "imdb" en Notion (Rich Text)
        await updateNotionPage(
          serie.id,
          imdbRating,
          serie.properties.Título.title[0]?.plain_text
        );
      } else {
        console.log(
          `Serie "${serie.properties.Título.title[0]?.plain_text}" no tiene IMDb_ID.`
        );
      }
    }

    console.log("Proceso completado exitosamente");
  } catch (error) {
    console.error("Error en el proceso:", error.message);
  }
}

// Ejecutar la función principal
handlerCalendarioSeries();
