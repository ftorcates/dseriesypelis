import { Client } from "@notionhq/client";
import { NextApiResponse } from "next";

export default async function handler(res: NextApiResponse) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "166bb7d905e24b41a0ce7d26feef35b7";

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "fechaDesde",
            date: {
              equals: "2024-09-09",
            },
          },
          {
            property: "fechaHasta",
            date: {
              equals: "2024-09-15",
            },
          },
        ],
      },
      /*filter: {
        property: "CadenaPlataforma", // Cambia esto por el nombre de la propiedad que deseas filtrar
        select: {
          //equals: "Apple TV+", // Cambia esto por el valor que deseas filtrar
          equals: "Netflix", // Cambia esto por el valor que deseas filtrar
        },
      },*/
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
