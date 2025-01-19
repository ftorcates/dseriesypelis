import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Inicio",
        href: "/home",
      },
      {
        icon: "/teacher.png",
        label: "Noticias",
        href: "/coming-soon",
      },
    ],
  },
  {
    title: "SERIES",
    items: [
      {
        icon: "/student.png",
        label: "En emisión",
        href: "/list/en-emision",
      },
      {
        icon: "/calendar.png",
        label: "Próximos estrenos",
        href: "/list/series-por-estrenar",
      },
      {
        icon: "/calendar.png",
        label: "Calendario estrenos",
        href: "/list/calendario-series",
      },
      {
        icon: "/calendar.png",
        label: "Calendario episodios",
        href: "/list/calendario-episodios",
      },
      {
        icon: "/class.png",
        label: "Renovadas",
        href: "/coming-soon",
      },
      {
        icon: "/class.png",
        label: "Canceladas",
        href: "/coming-soon",
      },
    ],
  },
  {
    title: "PELICULAS",
    items: [
      {
        icon: "/exam.png",
        label: "En cartelera",
        href: "/coming-soon",
      },
      {
        icon: "/calendar.png",
        label: "Próximos estrenos",
        href: "/coming-soon",
      },
      {
        icon: "/calendar.png",
        label: "Calendario de estrenos",
        href: "/list/calendario-peliculas-estreno",
      },
    ],
  },
  /*{
    title: "OTROS",
    items: [
      {
        icon: "/profile.png",
        label: "Perfil",
        href: "/home",
      },
      {
        icon: "/setting.png",
        label: "Configuración",
        href: "/home",
      },
      {
        icon: "/logout.png",
        label: "Cerrar sesión",
        href: "/home",
      },
    ],
  },*/
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
