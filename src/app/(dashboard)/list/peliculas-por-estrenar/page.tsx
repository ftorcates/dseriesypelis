"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

const PeliculasPorEstrenar = () => {
  const [peliculas, setPeliculas] = useState<PeliculasType[]>([]);

  useEffect(() => {
    fetch("/api/peliculasPorEstrenar")
      .then((response) => response.json())
      .then((data) => {
        console.log("Peliculas por estrenar", data.results);
        const formattedEstrenos: PeliculasType[] = data.results.map(
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

        setPeliculas(formattedEstrenos);
      })
      .catch((error) => console.error("Error fetching estrenos:", error));
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center w-full mb-8 mt-8">
        <div className="flex items-center justify-center border border-lamaSky rounded-lg w-[90%]">
          <span className="font-semibold text-lg text-gray-800 uppercase">
            Próximos estrenos
          </span>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        {peliculas.length === 0 ? (
          <div className="flex mb-2 justify-center items-center min-h-[10px]">
            <p className="text-xl font-serif italic text-gray-600">
              No hay películas próximas a estrenar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {peliculas.map((peli) => (
              <div
                key={peli.id}
                className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-full bg-lamaYellow p-2 rounded-t-lg">
                  <p className="text-center font-semibold">
                    {peli.tipoEstreno === "Cines" ? "Cines" : peli.streaming}
                  </p>
                </div>
                {peli.posterUrl ? (
                  <Image
                    src={peli.posterUrl}
                    alt={peli.titulo}
                    width={240}
                    height={360}
                    priority
                    className="w-full aspect-[2/3] object-cover mb-4"
                  />
                ) : (
                  // Imagen por defecto o placeholder
                  <div className="flex w-full aspect-[2/3] bg-gray-300 items-center justify-center mb-4">
                    No image
                  </div>
                )}
                <p className="mt-2 text-center font-semibold">{peli.titulo}</p>

                <p className="mt-2 text-center text-sm">
                  <b>Estreno: </b>
                  {peli.fechaEstreno}
                </p>
                <div
                  className={`flex w-[60%] p-2 rounded-lg items-center justify-center mt-2 ${
                    peli.etiqueta === "Adición a Catálogo"
                      ? "bg-orange-300"
                      : "bg-lamaSky"
                  }`}
                >
                  <p className="text-center text-xs">{peli.etiqueta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PeliculasPorEstrenar;
