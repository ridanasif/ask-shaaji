import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { comics } from "../data/comicsData";

const Comics = () => {
  const ComicCard = ({ comic }) => {
    return (
      <div className="bg-gray-50 border-2 p-4 dark:bg-neutral-800 dark:text-white border-black flex flex-col gap-y-2 hover:scale-105 transition-all hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-center">
        <div className="flex justify-end">
          <span className="font-light text-gray-600 dark:text-neutral-400 text-xs">
            {comic.date}
          </span>
        </div>
        <img src={comic.coverImage} />
        <h3 className="text-2xl bangers">{comic.title}</h3>
      </div>
    );
  };

  return (
    <>
      <div className="w-screen min-h-screen relative flex flex-col">
        <header className="w-screen py-5 border-b-2 border-black sticky top-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md">
          <Link to="/">
            <Logo
              useEditions={false}
              className="text-2xl md:absolute md:left-5 md:text-3xl"
            />
          </Link>
          <h1 className="bangers text-3xl text-center dark:text-white">
            Life of shaaji!
          </h1>
        </header>
        <section className="min-h-96 bg-gradient-to-br from-orange-600 to-orange-400 grid md:grid-cols-2 border-b-2 border-black">
          <div className="place-content-center flex flex-col gap-y-2 px-10 py-10">
            <h2 className="bangers text-6xl text-center md:text-left md:text-7xl lg:text-8xl text-white">
              The Daily Life of Shaaji
            </h2>
            <h3 className="text-white text-center md:text-left text-lg">
              A heartfelt and hilarious collection of stories from the moments
              that make our favorite uncle who he is.
            </h3>
          </div>
          <div className="h-full w-full overflow-hidden place-items-end place-content-center border-l-2 border-black">
            <img
              src="shaaji-comics.png"
              className="w-full object-cover h-full"
            />
          </div>
        </section>
        <main className="p-5 space-y-6 grow">
          <div>
            <h2 className="text-3xl md:text-4xl bangers dark:text-white">
              Explore Collections.
            </h2>
            <h3 className="text-gray-600 text-sm dark:text-neutral-400">
              New editions will be released weekly. Stay tuned!
            </h3>
          </div>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {comics.map((comic) => (
              <Link to={`/comics/${comic.slug}`} key={comic.slug}>
                <ComicCard comic={comic} />
              </Link>
            ))}
          </div>
        </main>
        <footer className="w-screen p-5 bg-gray-100 text-center dark:bg-neutral-950 dark:text-neutral-400">
          &copy; AskShaaji {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
};
export default Comics;
