import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const PlanManagement = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-0 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <button
          onClick={() => navigate("/profile")}
          className="text-sm text-green-400 hover:underline mb-2"
        >
          ← {t.backToProfile || "Quay lại trang hồ sơ"}
        </button>

        <h1 className="text-3xl font-bold mb-4">{t.managePlan}</h1>

        <div className="bg-[#282828] rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-48">
            <img
              src="https://tse4.mm.bing.net/th/id/OIP.2ftLweH59d4SfsAsPWjF0AHaEg?r=0&w=288&h=288&c=7"
              alt="Plan Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="relative z-10 h-full flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                TieM Free
              </h2>
            </div>
          </div>

          <div className="p-6 bg-[#181818]">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
              {(t.planFeatures || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <hr className="my-4 border-gray-600" />
            <p className="text-lg font-bold">{t.free}</p>
          </div>
        </div>

        <div className="text-center">
          <button className="mt-4 border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
            {t.tryPremium}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
