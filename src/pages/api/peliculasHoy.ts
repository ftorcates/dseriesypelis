import { Client } from "@notionhq/client";
import { NextApiResponse } from "next";

export default async function handlerPeliculasHoy(res: NextApiResponse) {
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
              equals: hoy,
            },
          },
          {
            property: "Estreno",
            date: {
              equals: hoy,
            },
          },
        ],
      },
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
