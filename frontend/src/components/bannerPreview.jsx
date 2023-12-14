import React, { useState, useEffect } from "react";


function BannerPreview({ banner, name}) {
    const [backgroundStyle, setBackgroundStyle] = useState({});

    useEffect(() => {
      if (banner) {
        setBackgroundStyle({
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      } else {
        // Generar un color aleatorio
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        setBackgroundStyle({
          background: `linear-gradient(45deg, ${randomColor}, #FFFFFF)`,
        });
      }
    }, [banner]);

    return (
      <>
        <div className="text-primary">
          {/* group banner */}
          <div
            className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md shadow-lg"
            style={backgroundStyle}
          >
            <h1 className="text-center text-6xl font-semibold ">
              {name}
            </h1>
          </div>
        </div>
      </>
    );
  }

export default BannerPreview;