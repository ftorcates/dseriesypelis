"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type PeliculasHoyType = {
  id: string;
  streaming: string;
  tipoEstreno: string;
  posterUrl: string;
  titulo: string;
  etiqueta: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    TipoEstreno: { select: { name: string } };
    Streaming?: { select: { name: string } };
    Poster: { files: Array<{ file: { url: string } }> };
    Titulo: { title: Array<{ plain_text: string }> };
    Etiquetas: { multi_select: Array<{ name: string }> };
  };
};

const PeliculasHoy = () => {
  const [peliculas, setPeliculas] = useState<PeliculasHoyType[]>([]);

  useEffect(() => {
    fetch("/api/peliculasHoy")
      .then((response) => response.json())
      .then((data) => {
        console.log("Peliculas hoy", data.results);
        const formattedPeliculas: PeliculasHoyType[] = data.results.map(
          (item: NotionApiResponse) => ({
            id: item.id,
            tipoEstreno: item.properties.TipoEstreno.select.name,
            streaming: item.properties.Streaming?.select?.name || "",
            posterUrl: item.properties.Poster.files[0].file.url,
            titulo: item.properties.Titulo.title[0].plain_text,
            etiqueta: item.properties.Etiquetas.multi_select[0].name,
          })
        );

        setPeliculas(formattedPeliculas);
      })
      .catch((error) => console.error("Error fetching películas:", error));
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center w-full mb-2">
        <div className="flex items-center justify-center border border-lamaSky rounded-lg w-[90%]">
          <span className="font-semibold text-lg text-gray-800 uppercase">
            Películas de Hoy
          </span>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        {peliculas.length === 0 ? (
          <div className="flex mb-2 justify-center items-center min-h-[10px]">
            <p className="text-xl font-serif italic text-gray-600">
              No hay películas para hoy
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {peliculas.map((pelicula) => (
              <SwiperSlide key={pelicula.id}>
                <div className="flex flex-col items-center">
                  <div className="w-full bg-lamaYellow p-2">
                    <p className="text-center font-semibold">
                      {pelicula.tipoEstreno === "Cines"
                        ? "Cines"
                        : pelicula.streaming}
                    </p>
                  </div>
                  <Image
                    src={pelicula.posterUrl}
                    alt={pelicula.titulo}
                    width={240}
                    height={360}
                    priority
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <p className="mt-2 text-center font-semibold">
                    {pelicula.titulo}
                  </p>
                  <div className="flex w-[60%] bg-lamaSky p-2 rounded-lg items-center justify-center">
                    <p className="text-center text-xs">{pelicula.etiqueta}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default PeliculasHoy;
