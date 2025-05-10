import { languages } from "@/app/i18n/settings";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="py-2 px-3 w-screen bg-gray-50 relative dark:bg-gray-900 h-screen flex flex-col gap-2">
        <Navbar />
        <div className="flex gap-10 overflow-auto mt-22">
            <Sidebar />
            {children}
        </div>
    </main>
  );
}
