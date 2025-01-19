"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type EstrenosType = {
  id: string;
  cadenaPlataforma: string;
  episodio: string;
  posterUrl: string;
  serie: string;
  temporada: string;
  tags: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    CadenaPlataforma: { multi_select: Array<{ name: string }> };
    Episodio: { rich_text: Array<{ plain_text: string }> };
    Poster: { files: Array<{ file: { url: string } }> };
    Serie: { title: Array<{ plain_text: string }> };
    Temporada: { rich_text: Array<{ plain_text: string }> };
    Tags?: { multi_select: Array<{ name: string }> };
  };
};

const EstrenosHoy = () => {
  const [estrenos, setEstrenos] = useState<EstrenosType[]>([]);

  useEffect(() => {
    fetch("/api/episodiosHoy")
      .then((response) => response.json())
      .then((data) => {
        const formattedEstrenos: EstrenosType[] = data.results.map(
          (item: NotionApiResponse) => (
            console.log("episodios hoy", item.properties),
            {
              id: item.id,
              cadenaPlataforma:
                item.properties.CadenaPlataforma.multi_select[0].name,
              episodio: item.properties.Episodio.rich_text[0].plain_text,
              posterUrl: item.properties.Poster.files[0].file.url,
              serie: item.properties.Serie.title[0].plain_text,
              temporada: item.properties.Temporada.rich_text[0].plain_text,
              tags: item.properties.Tags?.multi_select[0]?.name,
            }
          )
        );

        setEstrenos(formattedEstrenos);
      })
      .catch((error) => console.error("Error fetching estrenos:", error));
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-center w-full mb-2">
        <div className="flex items-center justify-center border border-lamaSky rounded-lg w-[90%]">
          <span className="font-semibold text-lg text-gray-800 uppercase">
            Episodios de Hoy
          </span>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        {estrenos.length === 0 ? (
          <div className="flex mb-2 justify-center items-center min-h-[10px]">
            <p className="text-xl font-serif italic text-gray-600">
              No hay episodios nuevos para hoy
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
            {estrenos.map((estreno) => (
              <SwiperSlide key={estreno.id}>
                <div className="flex flex-col items-center">
                  <div className="w-full bg-lamaYellow p-2">
                    <p className="text-center font-semibold">
                      {estreno.cadenaPlataforma}
                    </p>
                  </div>

                  <Image
                    src={estreno.posterUrl}
                    alt={estreno.serie + " - " + estreno.episodio}
                    width={240}
                    height={360}
                    priority
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <p className="mt-2 text-center font-semibold">
                    {estreno.serie}
                  </p>
                  <p className="mt-2 text-center">{estreno.episodio}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default EstrenosHoy;
