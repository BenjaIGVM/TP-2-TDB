import Link from 'next/link';
import { useState, useEffect } from 'react';

function GroupHeader({isAdmin,GroupId, GroupName, GroupBanner }) {
  const [backgroundStyle, setBackgroundStyle] = useState({});

  useEffect(() => {
    if (GroupBanner) {
      setBackgroundStyle({
        backgroundImage: `url(${GroupBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      });
    } else {
      // Generar un color aleatorio
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      setBackgroundStyle({
        background: `linear-gradient(45deg, ${randomColor}, #FFFFFF)`,
      });
    }
  }, [GroupBanner]);

  // comprobar si el usuario es admin del grupo


  return (
    <>
      <div className="text-bgDarkColor">
        {/* group banner */}
        <div
          className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md shadow-lg"
          style={backgroundStyle}
        >
          <h1 className="text-center text-6xl font-semibold ">
            {GroupName}
          </h1>
        </div>
        {/* Group options */}
        <div className="my-2 flex dark:text-primary flex-row justify-evenly rounded-md bg-foreground p-2 font-semibold text-black shadow-md dark:bg-accentDarkColor">
          <Link href={`/${GroupId}/home`}>Inicio</Link>
          <Link href={`/${GroupId}/members`}>Miembros</Link>
          {isAdmin && <Link href={`/${GroupId}/options`}>Opciones</Link>}
        </div>
      </div>
    </>
  );
}

export default GroupHeader;
