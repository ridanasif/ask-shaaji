import { useParams, Link } from "react-router-dom";
import { comics as comicsData } from "../data/comicsData";
import { ArrowLeft } from "lucide-react";

const ComicViewer = () => {
  const { slug } = useParams(); // Get the 'slug' from the URL, e.g., "viral-shaaji"
  const comic = comicsData.find((c) => c.slug === slug);

  if (!comic) {
    return (
      <div className="w-screen h-screen  flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-6xl bangers text-red-500">Comic Not Found!</h1>
        <p className="text-gray-600 dark:text-neutral-500 mt-2">
          We couldn't find the comic you were looking for.
        </p>
        <Link
          to="/comics"
          className="mt-6 bangers outline-0 text-2xl bg-orange-500 text-black px-8 py-2 rounded-md hover:bg-orange-400 transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-t  from-orange-500 to-orange-400 flex flex-col">
      <header className="w-full py-3 bg-white dark:bg-neutral-900 flex items-center justify-between px-5 border-b-2 border-black">
        <h1 className="bangers text-2xl md:text-3xl dark:text-white">
          Life of shaaji!
        </h1>
        <Link
          to="/comics"
          className="bangers text-lg md:text-xl bg-orange-500 text-black px-3 py-2 rounded-md hover:bg-orange-400 transition-colors flex items-center gap-2 outline-0 "
        >
          <ArrowLeft />
          Back to Gallery
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <img
          src={comic.comic}
          alt={`Comic page for ${comic.name}`}
          className="max-w-full max-h-[85vh] hover:scale-105 transition-transform border-2 border-black shadow-2xl shadow-orange-500/20"
        />
      </main>
    </div>
  );
};

export default ComicViewer;
