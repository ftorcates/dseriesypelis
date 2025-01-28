"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full h-[350px] rounded-lg overflow-hidden">
      <Image
        src="/banners/YourFriendlyNeighborhoodSpiderMan.jpg"
        alt="Prime Target - Apple TV+"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start">
        <h1 className="text-white text-4xl font-bold text-center mb-4 ml-4">
          D Series y Pelis
        </h1>
      </div>
    </div>
  );
}
