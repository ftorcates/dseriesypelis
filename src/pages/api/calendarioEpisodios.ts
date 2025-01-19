import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerCalendarioEpisodios(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const databaseId = "95ba85336ec04705b6eb38ce86e9d022";

    // Obtener fecha actual
    const today = new Date();

    // Obtener el lunes de la semana actual
    const monday = new Date(today);
    monday.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    // Obtener el domingo de la semana actual
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 13);

    // Formatear fechas para Notion (YYYY-MM-DD)
    const mondayStr = monday.toISOString().split("T")[0];
    const sundayStr = sunday.toISOString().split("T")[0];

    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      filter: {
        and: [
          {
            property: "Fecha",
            date: {
              on_or_after: mondayStr,
            },
          },
          {
            property: "Fecha",
            date: {
              on_or_before: sundayStr,
            },
          },
          {
            property: "CadenaPlataforma",
            multi_select: {
              does_not_contain: "Crunchyroll",
            },
          },
        ],
      },
      sorts: [
        {
          property: "Fecha",
          direction: "ascending",
        },
        {
          property: "Serie",
          direction: "ascending",
        },
      ],
    });

    if (response.has_more && response.next_cursor) {
      const nextPage = await notion.databases.query({
        database_id: databaseId,
        page_size: 20,
        start_cursor: response.next_cursor,
        filter: {
          and: [
            {
              property: "Fecha",
              date: {
                on_or_after: mondayStr,
              },
            },
            {
              property: "Fecha",
              date: {
                on_or_before: sundayStr,
              },
            },
            {
              property: "CadenaPlataforma",
              multi_select: {
                does_not_contain: "Crunchyroll",
              },
            },
          ],
        },
        sorts: [
          {
            property: "Fecha",
            direction: "ascending",
          },
          {
            property: "Serie",
            direction: "ascending",
          },
        ],
      });

      response.results = [...response.results, ...nextPage.results];
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error en API:", error);
    res.status(500).json({
      message: "Error querying Notion API",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
