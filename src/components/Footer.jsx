import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const Footer = () => {
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const links = t.footerSections;

  return (
    <footer className="bg-black text-white px-8 py-12 border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
        {links.map((section, idx) => (
          <div key={idx} className="min-w-[150px]">
            <h3 className="font-bold mb-2">{section.title}</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              {section.items.map((item, i) => (
                <li key={i} className="hover:text-white cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex items-start gap-4 mt-4 md:mt-0">
          <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-600"><FaInstagram /></a>
          <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-600"><FaTwitter /></a>
          <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-600"><FaFacebookF /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
