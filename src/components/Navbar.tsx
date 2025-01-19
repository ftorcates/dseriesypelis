import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800">
      {/* SEARCH BAR */}
      <div className="w-3/4">
        <span className="text-lamaYellow">
          ...porque siempre es tiempo de series y películas
        </span>
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-1/4">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/avatar.png"
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
