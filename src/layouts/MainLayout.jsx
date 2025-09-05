import { useState } from "react";
import { Link, Outlet } from "react-router-dom"; // Import Outlet
import Footer from "../components/Footer";
import { useLanguageStore } from "../store/languageStore";
import SupportModal from "../ui/SupportModal";
import WallOfFame from "../ui/WallOfFame";
import { DonationProgressBar } from "../ui/WallOfFame";


// The Layout no longer takes 'children' as a prop
export default function MainLayout() {
  const { language } = useLanguageStore();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col dark:bg-neutral-900">
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {language !== "ml" ? (
        <div className="w-full p-2 text-center bg-gradient-to-r from-violet-400 to-red-500">
          <span
            className="text-white text-base cursor-pointer"
            onClick={() => setIsSupportModalOpen(true)}
          >
            Love what we built? Support us by clicking{" "}
            <span className="underline">here!</span>
          </span>
        </div>
      ) : (
        <div className="w-full p-2 text-base md:text-xl font-bold text-center bg-gradient-to-r from-green-300 to-yellow-300 dark:from-green-400 dark:to-yellow-400 text-green-950">
          <Link to="/kaineetam" className="chilanka">
            ഈ വർഷത്തെ ഏറ്റവും വലിയ കയ്നീട്ടം ആര് തരും? നിങ്ങളുടെ സ്ഥാനം
            ഉറപ്പിക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക!
          </Link>
        </div>
      )}

      <DonationProgressBar />
      <WallOfFame />

      {/* The Outlet is where Home or Results will be rendered */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
