"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SeriesType = {
  id: string;
  cadenaPlataforma: string;
  posterUrl: string;
  serie: string;
  temporada: string;
  episodio: string;
  fechaInicio: string;
};

const CalendarioEpisodios = () => {
  const [series, setSeries] = useState<SeriesType[]>([]);
  const [currentWeek, setCurrentWeek] = useState<"current" | "next">("current");
  const [isLoading, setIsLoading] = useState(true);
  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Colores por plataforma
  const platformColors: { [key: string]: string } = {
    ABC: "bg-gray-700",
    AMC: "bg-cyan-500",
    "Apple TV+": "bg-gray-800",
    CBS: "bg-gray-900",
    "Disney+": "bg-indigo-500",
    FOX: "bg-blue-700",
    Hulu: "bg-green-400",
    MAX: "bg-blue-600",
    "MGM+": "bg-amber-500",
    "Movistar+": "bg-blue-300",
    NBC: "bg-purple-600",
    Netflix: "bg-red-500",
    "Paramount+": "bg-blue-500",
    Peacock: "bg-green-600",
    "Prime Video": "bg-blue-500",
    "The CW": "bg-orange-500",
    // Añade más plataformas según necesites
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/calendarioEpisodios")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Calendario episodios", data.results);
        setSeries(
          data.results.map((item: any) => ({
            id: item.id,
            cadenaPlataforma:
              item.properties.CadenaPlataforma.multi_select[0].name,
            posterUrl: item.properties.Poster?.files[0]?.file?.url,
            serie: item.properties.Serie.title[0].plain_text,
            temporada: item.properties.Temporada.rich_text[0].plain_text,
            episodio: item.properties.Episodio.rich_text[0].plain_text,
            fechaInicio: item.properties.Fecha.date.start,
          }))
        );
      })
      .catch((error) => {
        console.error("Error en componente:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getSeriesForDate = (dayIndex: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    if (currentWeek === "next") {
      monday.setDate(monday.getDate() + 7);
    }

    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dayIndex);

    const dateString = targetDate.toISOString().split("T")[0];
    return series.filter((serie) => serie.fechaInicio === dateString);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentWeek("current")}
          className={`px-4 py-2 rounded-lg ${
            currentWeek === "current"
              ? "bg-lamaSky text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Semana Actual
        </button>
        <h2 className="text-2xl font-bold">
          Episodios de {currentWeek === "current" ? "esta" : "próxima"} semana
        </h2>
        <button
          onClick={() => setCurrentWeek("next")}
          className={`px-4 py-2 rounded-lg ${
            currentWeek === "next"
              ? "bg-lamaSky text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Semana Siguiente
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Cabecera con días de la semana */}
        {weekDays.map((day, index) => {
          const date = new Date();
          const monday = new Date(date);
          monday.setDate(
            date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
          );

          if (currentWeek === "next") {
            monday.setDate(monday.getDate() + 7);
          }

          const currentDate = new Date(monday);
          currentDate.setDate(monday.getDate() + index);

          return (
            <div key={day} className="text-center font-bold p-2">
              <div>{day}</div>
              <div className="text-sm text-gray-600">
                {currentDate.getDate().toString().padStart(2, "0")}/
                {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
              </div>
            </div>
          );
        })}

        {/* Días de la semana */}
        {weekDays.map((_, index) => (
          <div key={index} className="border min-h-[100px] p-2">
            <div className="mt-1">
              {getSeriesForDate(index).map((serie) => (
                <div
                  key={serie.id}
                  className={`text-xs p-1 mb-1 rounded text-white ${
                    platformColors[serie.cadenaPlataforma] || "bg-gray-500"
                  } flex gap-2`}
                  title={`${serie.serie} - ${serie.temporada} (${serie.cadenaPlataforma})`}
                >
                  {/* Poster */}
                  {serie.posterUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={serie.posterUrl}
                        alt={serie.serie}
                        width={40}
                        height={60}
                        className="w-10 aspect-[2/3] rounded object-cover"
                      />
                    </div>
                  )}

                  {/* Información */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="text-sm font-semibold">{serie.serie}</div>
                    <div className="text-xs opacity-90">{serie.temporada}</div>
                    <div className="text-xs opacity-90">{serie.episodio}</div>
                  </div>
                </div>
              ))}
            </div>
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

export default CalendarioEpisodios;
