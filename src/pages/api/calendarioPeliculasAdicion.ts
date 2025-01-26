import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerCalendarioPeliculasAdicion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "a7cbde4803b7403287c10620be2be787";

  try {
    const hoy = new Date().toISOString().split("T")[0];
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Estreno",
            date: {
              is_not_empty: true,
            },
          },
          {
            property: "Estreno",
            date: {
              after: "2025-01-01",
            },
          },
          {
            property: "Etiquetas",
            multi_select: {
              contains: "Adición a Catálogo",
            },
          },
        ],
      },
      sorts: [
        {
          property: "Estreno",
          direction: "ascending", // o "descending" para orden descendente
        },
        {
          property: "Titulo",
          direction: "ascending",
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error querying Notion API", error: errorMessage });
  }
}
