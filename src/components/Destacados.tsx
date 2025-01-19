"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// TEMPORARY
const destacados = [
  {
    id: 1,
    title: "Slow Horses T4",
    img: "/SlowHorses4.jpeg",
  },
  {
    id: 2,
    title: "The Perfect Couple",
    img: "/ThePerfectCouple.jpg",
  },
  {
    id: 3,
    title: "Beetlejuice Beetlejuice",
    img: "/BeetlejuiceBeetlejuice.jpeg",
  },
  ,
  {
    id: 4,
    title: "His Three Daughters",
    img: "/HisThreeDaughters.jpg",
  },
];

type ResumenType = {
  id: string;
  title: string;
  plattform: string;
  img: string;
};

type NotionApiResponse = {
  properties: {
    id: { title: [{ plain_text: string }] };
    descripcion: { rich_text: [{ plain_text: string }] };
  };
};

const Destacados = () => {
  const [destacadosPosters, setDestacadosPosters] = useState<ResumenType[]>([]);

  useEffect(() => {
    fetch("/api/destacados")
      .then((response) => response.json())
      .then((data) => {
        console.log("destacados ", data);
        const formattedCards: ResumenType[] = data.results.map(
          (item: NotionApiResponse) => {
            console.log(data);

            return {
              id: item.properties.id.title[0].plain_text,
              title: item.properties.descripcion.rich_text[0].plain_text, // Ajusta según la estructura de tus datos
              //img: item.properties.img.files[0].file.url,
            };
          }
        );
        console.log("1", formattedCards);

        setDestacadosPosters(formattedCards);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center w-full">
        <div className=" flex items-center justify-center border border-lamaSky rounded-lg w-[90%]">
          <span className="font-semibold text-lg text-gray-800 uppercase">
            Estrenos destacados de la semana
          </span>
        </div>
      </div>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center">
        {destacadosPosters.map((destacado) => (
          <Image
            key={destacado?.id}
            src={destacado?.img}
            alt={destacado?.title}
            width={240}
            height={240}
            className="w-[240px] h-[300px] object-cover"
          />
        ))}
      </div>
    </>
  );
};

export default Destacados;
