'use client'

import { languages } from "@/app/i18n/settings";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

// export async function generateStaticParams() {
//   return languages.map((lng) => ({ lng }))
// }

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [ hideSidebar, setHideSidebar ] = useState<boolean>(false);

  return (
    <main className="py-2 px-3 w-screen bg-gray-200 relative dark:bg-gray-900 h-screen flex flex-col gap-2 ">
        <Navbar setHideSidebar={setHideSidebar} hideSidebar={hideSidebar} />
        <div className="flex gap-10 w-full overflow-hidden mt-22">
            { !hideSidebar && <Sidebar />}
            <div className="w-full h-[80vh] max-md:h-[90vh] overflow-auto">
              {children}
            </div>
        </div>
    </main>
  );
}
