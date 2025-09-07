import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Footer from "../components/Footer";
import SupportModal from "../ui/SupportModal";
import WallOfFame from "../ui/WallOfFame";
import { DonationProgressBar } from "../ui/WallOfFame";

// The Layout no longer takes 'children' as a prop
export default function MainLayout() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col dark:bg-neutral-900">
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <div className="w-full p-2 text-center bg-gradient-to-r from-violet-400 to-red-500">
        <span
          className="text-white text-base cursor-pointer"
          onClick={() => setIsSupportModalOpen(true)}
        >
          Love what we built? Support us by clicking{" "}
          <span className="underline">here!</span>
        </span>
      </div>

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
