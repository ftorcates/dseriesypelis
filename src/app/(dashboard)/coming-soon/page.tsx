import Image from "next/image";

const EnConstruccion = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Contenedor principal */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        {/* Icono de construcción */}
        <div className="mb-6">
          <Image
            src="/coming-soon.avif" // Necesitarás añadir este ícono
            alt="En construcción"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          En Construcción
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          Esta funcionalidad está actualmente en desarrollo y estará disponible
          próximamente.
        </p>

        {/* Barra de progreso estilizada */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-lamaYellow h-2.5 rounded-full w-3/4 animate-pulse"></div>
        </div>

        {/* Etiqueta de "Próximamente" */}
        <span className="inline-block bg-lamaSky text-white text-sm px-4 py-2 rounded-full">
          Próximamente
        </span>
      </div>
    </div>
  );
};

export default EnConstruccion;
