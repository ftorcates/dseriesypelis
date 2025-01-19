import { Client } from "@notionhq/client";
import { NextApiResponse } from "next";

export default async function handlerPlataformasSeries(res: NextApiResponse) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = "64143e7030654d14ab5c213a78ec0634";

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "FechaInicio",
            date: {
              on_or_after: "2024-09-16",
            },
          },
          {
            property: "FechaInicio",
            date: {
              on_or_before: "2024-09-22",
            },
          },
        ],
      },
      sorts: [
        {
          property: "FechaInicio",
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
