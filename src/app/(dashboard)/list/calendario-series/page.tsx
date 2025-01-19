"use client";

import { useEffect, useState } from "react";

type SeriesPorEstrenarType = {
  id: string;
  cadenaPlataforma: string;
  posterUrl: string;
  serie: string;
  temporada: string;
  fechaInicio: string;
  fechaFin: string;
};

const CalendarioSeries = () => {
  const [series, setSeries] = useState<SeriesPorEstrenarType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Colores por plataforma
  const platformColors: { [key: string]: string } = {
    ABC: "bg-gray-600",
    AMC: "bg-cyan-500",
    "Apple TV+": "bg-gray-700",
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

  const changeMonth = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + offset);
      return newDate;
    });
  };

  useEffect(() => {
    fetch("/api/calendarioSeries")
      .then((response) => response.json())
      .then((data) => {
        setSeries(
          data.results.map((item: any) => ({
            id: item.id,
            cadenaPlataforma: item.properties.CadenaPlataforma.select.name,
            posterUrl: item.properties.Poster?.files[0]?.file?.url,
            serie: item.properties.Título.title[0].plain_text,
            temporada: item.properties.Temporada.rich_text[0].plain_text,
            fechaInicio: item.properties.FechaInicio.date.start,
            fechaFin: item.properties.FechaFin?.date?.start,
          }))
        );
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

  const getSeriesForDate = (date: Date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return series.filter((serie) => serie.fechaInicio === dateString);
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
                  {getSeriesForDate(date).map((serie) => (
                    <div
                      key={serie.id}
                      className={`text-xs p-1 mb-1 rounded text-white ${
                        platformColors[serie.cadenaPlataforma] || "bg-gray-500"
                      }`}
                      title={`${serie.serie} - ${serie.temporada} (${serie.cadenaPlataforma})`}
                    >
                      {serie.serie}
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

export default CalendarioSeries;
