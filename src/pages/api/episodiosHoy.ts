import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handlerEpisodiosHoy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "95ba85336ec04705b6eb38ce86e9d022";

  try {
    const hoy = new Date().toISOString().split("T")[0];
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Fecha",
            date: {
              equals: hoy,
            },
          },
          {
            property: "Fecha",
            date: {
              equals: hoy,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Serie",
          direction: "ascending",
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log("Errrroooorrrrr 1234");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Error querying Notion API", error: errorMessage });
  }
}
