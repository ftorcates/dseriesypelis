"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "The Sex Lives of College Girls",
    time: "MAX",
    description: "Temporada 2",
    date: "23/01/2025",
  },
  {
    id: 2,
    title: "The Agency",
    time: "Paramount+",
    description: "Temporada 1",
    date: "24/01/2025",
  },
  {
    id: 3,
    title: "Okura: Cold Case Investigation",
    time: "Netflix",
    description: "Temporada 1",
    date: "25/01/2025",
  },
];

type FinalesType = {
  id: string;
  title: string;
  cadena: string;
  fechaFin: string;
  temporada: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    Temporada: { rich_text: [{ plain_text: string }] };
    Título: { title: [{ plain_text: string }] };
    CadenaPlataforma: { select: { name: string } };
    FechaFin: { date: { start: string } };
  };
};

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [finalesTemporadas, setFinalesTemporadas] = useState<FinalesType[]>([]);

  useEffect(() => {
    fetch("/api/finalesTemporada")
      .then((response) => response.json())
      .then((data) => {
        console.log("Proximos finales de temporada", data.results);
        const formattedCards: FinalesType[] = data.results.map(
          (item: NotionApiResponse) => {
            const temp = item.properties.Temporada.rich_text[0].plain_text;
            //console.log(temp);

            const temporada = "Temporada " + temp.slice(1);
            //console.log(temporada);

            return {
              id: item.id,
              title: item.properties.Título.title[0].plain_text, // Ajusta según la estructura de tus datos
              cadena: item.properties.CadenaPlataforma.select.name,
              fechaFin: item.properties.FechaFin.date.start,
              temporada,
            };
          }
        );

        setFinalesTemporadas(formattedCards);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">
          Próximos finales de temporada
        </h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {finalesTemporadas.map((final) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaYellow"
            key={final.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{final.title}</h1>
              <span className="text-gray-300 text-xs">{final.cadena}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="mt-2 text-gray-500 text-sm">{final.fechaFin}</p>
              <p className="mt-2 text-gray-300 text-sm">{final.temporada}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
