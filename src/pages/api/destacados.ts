import { Client } from "@notionhq/client";
import { NextApiResponse } from "next";

export default async function handlerDestacados(res: NextApiResponse) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "8e22dec49f1b4586830275d14a4f0240";

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
