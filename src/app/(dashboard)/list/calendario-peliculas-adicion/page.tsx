"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type PeliculasType = {
  id: string;
  streaming: string;
  tipoEstreno: string;
  posterUrl: string;
  titulo: string;
  etiqueta: string;
  fechaEstreno: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    TipoEstreno: { select: { name: string } };
    Streaming?: { select: { name: string } };
    Poster: { files: Array<{ file: { url: string } }> };
    Titulo: { title: Array<{ plain_text: string }> };
    Etiquetas: { multi_select: Array<{ name: string }> };
    Estreno: { date: { start: string } };
  };
};

const CalendarioPeliculasAdicion = () => {
  const [peliculas, setPeliculas] = useState<PeliculasType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Colores por plataforma/tipo
  const platformColors: { [key: string]: string } = {
    Netflix: "bg-red-500",
    "Prime Video": "bg-blue-500",
    "Disney+": "bg-indigo-500",
    MAX: "bg-blue-700",
    "Apple TV+": "bg-gray-700",
    Cines: "bg-gray-900",
    "Paramount+": "bg-blue-600",
    // Añade más según necesites
  };

  const changeMonth = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + offset);
      return newDate;
    });
  };

  useEffect(() => {
    fetch("/api/calendarioPeliculasAdicion")
      .then((response) => response.json())
      .then((data) => {
        console.log("Calendario peliculas adicion ", data.results);
        const formattedPeliculas: PeliculasType[] = data.results.map(
          (item: NotionApiResponse) => ({
            id: item.id,
            tipoEstreno: item.properties.TipoEstreno.select.name,
            streaming: item.properties.Streaming?.select?.name || "",
            posterUrl: item.properties.Poster?.files[0]?.file?.url || "",
            titulo: item.properties.Titulo.title[0].plain_text,
            etiqueta: item.properties.Etiquetas.multi_select[0].name,
            fechaEstreno: item.properties.Estreno.date.start,
          })
        );
        setPeliculas(formattedPeliculas);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getPeliculasForDate = (date: Date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return peliculas.filter((pelicula) => pelicula.fechaEstreno === dateString);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="p-4">
      <div className="mb-4 text-center flex items-center justify-center gap-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}

        {days.map((date, index) => (
          <div key={index} className="border min-h-[100px] p-2">
            {date && (
              <>
                <div className="text-right text-gray-500">{date.getDate()}</div>
                <div className="mt-1">
                  {getPeliculasForDate(date).map((pelicula) => (
                    <div
                      key={pelicula.id}
                      className={`text-xs p-1 mb-1 rounded text-white ${
                        platformColors[
                          pelicula.tipoEstreno === "Cines"
                            ? "Cines"
                            : pelicula.streaming
                        ] || "bg-gray-500"
                      } flex items-center gap-2`}
                      title={`${pelicula.titulo} - ${
                        pelicula.tipoEstreno === "Cines"
                          ? "Cines"
                          : pelicula.streaming
                      }`}
                    >
                      {pelicula.posterUrl && (
                        <Image
                          src={pelicula.posterUrl}
                          alt={pelicula.titulo}
                          width={20}
                          height={30}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="flex-1">{pelicula.titulo}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(platformColors).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-2">
            <div className={`w-4 h-4 ${color} rounded`}></div>
            <span className="text-sm">{platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioPeliculasAdicion;
