import React from "react";

import { BackIcon} from "./icons";

interface LayoutProps {
  header: React.ReactNode
}

const Layout: React.FC<LayoutProps> = function Layout({children, header}) {
  return (
    <div className="bg-gray-900 w-full">
      <header className="px-4 pt-2 pb">
        <button aria-label="Go back">
          <BackIcon className="text-white" />
        </button>
        <h1 className="text-4xl font-bold text-white">
          {header}
        </h1>
      </header>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
