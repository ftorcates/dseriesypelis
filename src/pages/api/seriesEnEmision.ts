import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerSeriesEnEmision(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const databaseId = "64143e7030654d14ab5c213a78ec0634";

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "EstadoEmision",
        formula: {
          string: {
            equals: "En emisión",
          },
        },
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

    console.log("responseSeriesEnEmision", response);

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error querying Notion API",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
