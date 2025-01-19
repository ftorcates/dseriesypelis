"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SeriesEnEmisionType = {
  id: string;
  cadenaPlataforma: string;
  posterUrl: string;
  serie: string;
  temporada: string;
};

type NotionApiResponse = {
  id: string;
  properties: {
    CadenaPlataforma: { select: { name: string } };
    Poster: { files: Array<{ file: { url: string } }> };
    Título: { title: Array<{ plain_text: string }> };
    Temporada: { rich_text: Array<{ plain_text: string }> };
  };
};

const SeriesEnEmision = () => {
  const [series, setSeries] = useState<SeriesEnEmisionType[]>([]);

  useEffect(() => {
    fetch("/api/seriesEnEmision")
      .then((response) => response.json())
      .then((data) => {
        const formattedEstrenos: SeriesEnEmisionType[] = data.data.results.map(
          (item: NotionApiResponse) =>
            //console.log("serie en emision", item.properties),
            ({
              id: item.id,
              cadenaPlataforma: item.properties.CadenaPlataforma.select.name,
              posterUrl: item.properties.Poster?.files[0]?.file?.url,
              serie: item.properties.Título.title[0].plain_text,
              temporada: item.properties.Temporada.rich_text[0].plain_text,
            })
        );

        setSeries(formattedEstrenos);
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
        {series.length === 0 ? (
          <div className="flex mb-2 justify-center items-center min-h-[10px]">
            <p className="text-xl font-serif italic text-gray-600">
              No hay series en emisión
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
            {series.map((serie) => (
              <SwiperSlide key={serie.id}>
                <div className="flex flex-col items-center">
                  <div className="w-full bg-lamaYellow p-2">
                    <p className="text-center font-semibold">
                      {serie.cadenaPlataforma}
                    </p>
                  </div>

                  <Image
                    src={serie.posterUrl}
                    alt={serie.serie}
                    width={240}
                    height={360}
                    className="w-full h-[360px] object-cover rounded-lg"
                  />
                  <p className="mt-2 text-center font-semibold">
                    {serie.serie}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default SeriesEnEmision;
