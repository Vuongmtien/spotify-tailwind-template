import React from "react";
import Footer from "./Footer";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";
import { useNavigate } from "react-router-dom";

const PodcastsPage = () => {
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;
  const navigate = useNavigate();

  const categories = t.podcastCategoriesList || [];

  const categoryRoutes = {
    [t.podcastCategoriesList[0]]: "/podcasts/rankings",
  };

  return (
    <div
      className="flex-1 min-h-screen text-white relative overflow-y-auto"

      style={{
        backgroundImage: `url('/podcast-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 p-8 pt-24">
        <h1 className="text-5xl font-bold mb-4">{t.podcastTitle}</h1>

        <div className="bg-black/60 p-6 rounded-lg max-w-xs mb-8">
          <h2 className="text-lg font-bold mb-2">{t.podcastBoxTitle}</h2>
          <p className="mb-4 text-sm">{t.podcastBoxDesc}</p>
          <button
            className="bg-white text-black font-semibold px-4 py-2 rounded hover:scale-105 transition"
            onClick={() => navigate("/podcasts")}
          >
            {t.podcastBoxButton}
          </button>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">{t.podcastCategories}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((title, index) => (
            <div
              key={index}
              onClick={() => {
                const route = categoryRoutes[title];
                if (route) navigate(route);
                else alert(`${t.podcastWipAlert} "${title}"`);
              }}
              className="cursor-pointer relative rounded-lg p-4 overflow-hidden hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: "#1f2937" }}
            >
              <div className="relative z-10 text-white text-lg font-semibold">
                {title}
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PodcastsPage;
