"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SeriesRenovadasType = {
  id: string;
  cadenaPlataforma: string;
  posterUrl: string;
  serie: string;
  temporada: string;
};

const SeriesRenovadas = () => {
  const [series, setSeries] = useState<SeriesRenovadasType[]>([]);

  // Colores por plataforma
  const platformColors: { [key: string]: string } = {
    Netflix: "bg-red-500",
    "Prime Video": "bg-blue-500",
    "Disney+": "bg-indigo-500",
    MAX: "bg-purple-600",
    "Apple TV+": "bg-gray-700",
    Peacock: "bg-green-600",
    "Paramount+": "bg-blue-500",
    // Añade más según necesites
  };

  useEffect(() => {
    fetch("/api/seriesRenovadas")
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        setSeries(
          data.results.map((item: any) => ({
            id: item.id,
            cadenaPlataforma: item.properties.CadenaPlataforma.select.name,
            posterUrl: item.properties.Poster?.files[0]?.file?.url,
            serie: item.properties.Título.title[0].plain_text,
            temporada: item.properties.Temporada.rich_text[0].plain_text,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Agrupar series por plataforma
  const seriesPorPlataforma = series.reduce((acc, serie) => {
    if (!acc[serie.cadenaPlataforma]) {
      acc[serie.cadenaPlataforma] = [];
    }
    acc[serie.cadenaPlataforma].push(serie);
    return acc;
  }, {} as { [key: string]: SeriesRenovadasType[] });

  return (
    <div className="p-4">
      {Object.entries(seriesPorPlataforma).map(([plataforma, series]) => (
        <div key={plataforma} className="mb-8">
          <h3
            className={`text-xl font-bold mb-4 p-3 rounded text-white ${
              platformColors[plataforma] || "bg-gray-500"
            }`}
          >
            {plataforma}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {series.map((serie) => (
              <div
                key={serie.id}
                className={`text-xs p-2 rounded text-white ${
                  platformColors[plataforma] || "bg-gray-500"
                } flex items-center gap-2`}
                title={`${serie.serie} - ${serie.temporada}`}
              >
                {serie.posterUrl && (
                  <Image
                    src={serie.posterUrl}
                    alt={serie.serie}
                    width={20}
                    height={30}
                    className="w-5 h-7 rounded object-cover"
                  />
                )}
                <span className="flex-1">{serie.serie}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeriesRenovadas;
