import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const PremiumPage = () => {
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 px-8 text-white">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.premiumTitle}</h1>
        <p className="text-lg md:text-xl mb-4">{t.premiumSubtitle}</p>

        <button className="bg-pink-300 text-black font-bold py-3 px-6 rounded-full mr-4 hover:scale-105 transition">
          {t.premiumTrialButton}
        </button>
        <button className="border border-white text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition">
          {t.premiumViewPlans}
        </button>

        <p className="mt-6 text-sm text-gray-300 max-w-xl">
          {t.premiumNote}{" "}
          <a href="#" className="underline">{t.premiumTerms}</a>
        </p>
      </div>
    </div>
  );
};


export default PremiumPage;
