"use client";

import notion from "@/lib/notion";
import { log } from "console";
import { useEffect, useState } from "react";

type CardType = {
  id: string;
  title: string;
  count: number;
};

// TEMPORARY
const cards = [
  {
    id: 1,
    title: "Nuevas series",
    count: 7,
  },
  {
    id: 2,
    title: "Nuevas temporadas",
    count: 3,
  },
  {
    id: 3,
    title: "Finales de temporadas",
    count: 1,
  },
  ,
  {
    id: 4,
    title: "Películas",
    count: 8,
  },
];

type NotionApiResponse = {
  properties: {
    id: { title: [{ plain_text: string }] };
    descripcion: { rich_text: [{ plain_text: string }] };
    contador: { number: number };
  };
};

const ResumeCards = () => {
  type WeekRangeType = { monday: string; sunday: string } | null;

  const [weekRange, setWeekRange] = useState<WeekRangeType>(null);
  const [notionCards, setNotionCards] = useState<CardType[]>([]);

  useEffect(() => {
    fetch("/api/notion")
      .then((response) => response.json())
      .then((data) => {
        console.log("ResumeCards", data.results);
        const formattedCards: CardType[] = data.results.map(
          (item: NotionApiResponse) => {
            return {
              id: item.properties.id.title[0].plain_text,
              title: item.properties.descripcion.rich_text[0].plain_text, // Ajusta según la estructura de tus datos
              count: item.properties.contador.number, // Ajusta según la estructura de tus datos
            };
          }
        );
        console.log("1", formattedCards);

        setNotionCards(formattedCards);
      })
      .catch((error) => console.error("Error fetching data:", error));
    const today: Date = new Date();
    const weekRange = getWeekRange(today);
    setWeekRange(weekRange);
  }, []);

  function getWeekRange(date: Date): { monday: string; sunday: string } {
    // Obtenemos el día de la semana (0 es domingo, 1 es lunes, etc.)
    const dayOfWeek: number = date.getDay();

    // Calculamos el lunes de la semana actual
    const monday: Date = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // Calculamos el domingo de la semana actual
    const sunday: Date = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Formateamos las fechas para que sean más legibles
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const mondayFormatted: string = monday.toLocaleDateString(
      undefined,
      options
    );
    const sundayFormatted: string = sunday.toLocaleDateString(
      undefined,
      options
    );

    return {
      monday: mondayFormatted,
      sunday: sundayFormatted,
    };
  }

  return (
    <div className="flex gap-4 justify-between flex-wrap">
      {notionCards.map((card: CardType) => (
        <div
          key={card.id}
          className="rounded-2xl odd:bg-lamaSky even:bg-lamaYellow p-4 flex-1 min-w-[130px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] bg-white px-2 py-1 rounded-full text-gray-600">
              {weekRange?.monday} - {weekRange?.sunday}
            </span>
          </div>
          <h1 className="text-2xl font-semibold my-4">{card?.count}</h1>
          <h2 className="capitalize text-sm font-medium text-gray-500">
            {card?.title}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default ResumeCards;
