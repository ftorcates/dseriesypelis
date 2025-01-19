import { Client } from "@notionhq/client";
import { NextApiResponse } from "next";

export default async function handlerDestacados(res: NextApiResponse) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "64143e7030654d14ab5c213a78ec0634";

  try {
    const hoy = new Date().toISOString().split("T")[0];
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "EstadoEmision",
        formula: {
          string: {
            equals: "En emisión", // o contains, starts_with, ends_with
          },
        },
      },
      sorts: [
        {
          property: "FechaInicio",
          direction: "ascending", // o "descending" para orden descendente
        },
        {
          property: "Título",
          direction: "ascending",
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log("Errrroooorrrrr");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error querying Notion API", error: errorMessage });
  }
}
