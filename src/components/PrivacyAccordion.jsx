import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const PrivacyAccordion = () => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const items = t.privacyAccordionItems || [];

  return (
    <div className="bg-[#1f1f1f] text-white rounded-lg overflow-hidden border border-gray-700">
      <div
        className="flex items-center justify-between p-4 bg-[#2a2a2a] hover:bg-[#333] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 font-semibold text-lg">
          🔒 {t.privacyAccordionTitle}
        </div>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>

      {open && (
        <div className="divide-y divide-gray-700">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-4 hover:bg-[#333] cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivacyAccordion;
