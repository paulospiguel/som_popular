import React from "react";

import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-4 live-ranking-festival dark:bg-slate-800 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
          <h1 className="text-5xl festival-title font-bold text-dourado-claro tracking-widest dark:text-verde-claro">
            SOM POPULAR FESTIVAL
          </h1>
          <p className="text-xl text-terra font-family-orbitron dark:text-verde-claro font-semibold tracking-wider mt-1">
            1ª EDIÇÃO
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
