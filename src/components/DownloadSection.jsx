import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const DownloadSection = () => {
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="relative h-[500px] w-full">
        <img
          src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/phan-mem-nghe-nhac-17.jpg"
          alt="Download Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 h-full w-full bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.downloadTitle}</h1>
          <p className="text-xl mb-4">{t.downloadSubtitle}</p>
          <a
            href="#"
            className="underline text-white hover:text-green-400 transition"
          >
            {t.downloadLink}
          </a>
        </div>
      </div>

      <div className="bg-white text-black text-center py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t.downloadDeviceTitle}
        </h2>
        <p className="mb-6 text-lg max-w-2xl mx-auto">
          {t.downloadDeviceDesc}
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="flex flex-col items-center">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="w-36 h-auto hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Google Play"
              className="w-36 h-auto hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png"
              alt="Microsoft Store"
              className="w-36 h-auto hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
