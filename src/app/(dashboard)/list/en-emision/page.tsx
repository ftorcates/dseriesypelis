"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SeriesEnEmisionType = {
  id: string;
  cadenaPlataforma: string;
  posterUrl: string;
  serie: string;
  temporada: string;
  fechaInicio: string;
  fechaFin: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    CadenaPlataforma: { select: { name: string } };
    Poster: { files: Array<{ file: { url: string } }> };
    Título: { title: Array<{ plain_text: string }> };
    Temporada: { rich_text: Array<{ plain_text: string }> };
    FechaInicio: { date: { start: string } };
    FechaFin: { date: { start: string } };
  };
};

const SeriesEnEmision = () => {
  const [series, setSeries] = useState<SeriesEnEmisionType[]>([]);

  useEffect(() => {
    fetch("/api/seriesEnEmision")
      .then((response) => response.json())
      .then((data) => {
        const formattedEstrenos: SeriesEnEmisionType[] = data.results.map(
          (item: NotionApiResponse) => (
            console.log("serie en emision", item.properties),
            {
              id: item.id,
              cadenaPlataforma: item.properties.CadenaPlataforma.select.name,
              posterUrl: item.properties.Poster?.files[0]?.file?.url,
              serie: item.properties.Título.title[0].plain_text,
              temporada: item.properties.Temporada.rich_text[0].plain_text,
              fechaInicio: item.properties.FechaInicio.date.start,
              fechaFin: item.properties.FechaFin?.date?.start,
            }
          )
        );

        setSeries(formattedEstrenos);
      })
      .catch((error) => console.error("Error fetching estrenos:", error));
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center w-full mb-8 mt-8">
        <div className="flex items-center justify-center border border-lamaSky rounded-lg w-[90%]">
          <span className="font-semibold text-lg text-gray-800 uppercase">
            Series en emisión
          </span>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        {series.length === 0 ? (
          <div className="flex mb-2 justify-center items-center min-h-[10px]">
            <p className="text-xl font-serif italic text-gray-600">
              No hay series en emisión
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {series.map((serie) => (
              <div
                key={serie.id}
                className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-full bg-lamaYellow p-2 rounded-t-lg">
                  <p className="text-center font-semibold">
                    {serie.cadenaPlataforma}
                  </p>
                </div>

                <Image
                  src={serie.posterUrl}
                  alt={serie.serie}
                  width={240}
                  height={360}
                  className="w-full h-[360px] object-cover mb-4"
                />
                <p className="mt-2 text-center font-semibold">
                  {serie.serie} - {serie.temporada}
                </p>
                <p className="mt-2 text-center text-sm">
                  <b>Inicio: </b>
                  {serie.fechaInicio}
                </p>
                <p className="mt-2 text-center text-sm">
                  <b>Fin: </b>
                  {serie.fechaFin ?? "Por confirmar"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SeriesEnEmision;
