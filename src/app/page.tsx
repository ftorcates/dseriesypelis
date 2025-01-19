"use client";
import EstrenosHoy from "@/components/EstrenosHoy";
import EventCalendar from "@/components/EventCalendar";
import PeliculasHoy from "@/components/PeliculasHoy";
import ResumeCards from "@/components/ResumeCards";

const Homepage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* RESUME CARDS */}
        <ResumeCards />
        {/* ESTRENOS HOY */}
        <EstrenosHoy />
        {/* PelICULAS HOY */}
        <PeliculasHoy />
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default Homepage;
