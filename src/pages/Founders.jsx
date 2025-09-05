import { ArrowLeft, InstagramIcon, LinkedinIcon, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/languageStore";
const Founders = () => {
  const { language } = useLanguageStore();
  const Section = ({ img, name, location, linkedin, instagram }) => {
    return (
      <div className="place-content-center place-items-center space-y-3 md:gap-y-6 text-center p-5">
        <img
          className="w-sm rounded-md shadow-lg transition-all hover:scale-105"
          src={img}
        />
        <div className="flex flex-col gap-y-3">
          <h1 className="text-base md:text-2xl font-medium dark:text-neutral-100">
            {name}
          </h1>
          <span className="text-center text-gray-500 flex justify-center text-sm items-center gap-x-1 dark:text-neutral-400">
            <MapPin className="text-gray-500 dark:text-neutral-400" size={16} />{" "}
            {location}
          </span>
          <span className="inline-flex justify-center gap-x-3 items-center">
            <a href={linkedin} target="_blank">
              <LinkedinIcon
                className="text-blue-400 transition-all hover:scale-150"
                size={16}
              />
            </a>
            <a href={instagram} target="_blank">
              <InstagramIcon
                className="text-red-500 transition-all hover:scale-150"
                size={16}
              />
            </a>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white dark:bg-neutral-900">
      <header className="w-full py-2 px-8 flex justify-between items-center text-lg border-b-[1px] border-gray-300 dark:border-neutral-700">
        <div className="flex-1">
          <Link
            to="/"
            className="dark:text-neutral-100 flex gap-x-2 text-sm items-center"
          >
            <ArrowLeft />{" "}
            <span className="hidden md:inline font-medium text-blue-500 dark:text-neutral-100">
              Back to main page
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-x-1 md:gap-x-3 text-sm md:text-lg font-bold dark:text-neutral-100">
          <img
            className="w-8 md:w-12"
            src={
              language === "ta"
                ? "tamil-head.png"
                : language === "mr"
                ? "marathi-head.png"
                : "mascot-head.png"
            }
          />
          <span>Creators of Shaaji</span>
        </div>
        <div className="grow"></div>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-neutral-900">
        <Section
          img={
            "https://media.licdn.com/dms/image/v2/D5603AQEk5m95M9dt-w/profile-displayphoto-crop_800_800/B56ZijybC8HcAM-/0/1755094562902?e=1758758400&v=beta&t=qnv5q4pFcXEnqBOwD55qX6h7GCXuir1478IgAEm2sK8"
          }
          name={"Ridan Asif"}
          location={"Kannur, Kerala"}
          linkedin={"https://www.linkedin.com/in/ridan-a-05b1491ab/"}
          instagram={"https://www.instagram.com/ridhaanasif/"}
        />
        <Section
          img={
            "https://media.licdn.com/dms/image/v2/D4D03AQEuAKG9j66GOw/profile-displayphoto-crop_800_800/B4DZf6soYfG8AI-/0/1752257702895?e=1758758400&v=beta&t=OIyR5VKj7KwpS8DmfsoZxA9A53Ys5Cx9-7JYydBd_xA"
          }
          name={"Sufiyan Salam"}
          location={"Thrissur, Kerala"}
          linkedin={"https://www.linkedin.com/in/sufiyan-salam-aa9134252/"}
          instagram={"https://www.instagram.com/sufiyan_salaam/"}
        />
      </div>
    </div>
  );
};
export default Founders;
