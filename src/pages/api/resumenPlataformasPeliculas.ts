import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerPlataformasSeries(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "a7cbde4803b7403287c10620be2be787";

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Estreno",
            date: {
              on_or_after: "2024-09-16",
            },
          },
          {
            property: "Estreno",
            date: {
              on_or_before: "2024-09-22",
            },
          },
        ],
      },
      sorts: [
        {
          property: "Estreno",
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
