import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-gray-100 py-3 dark:bg-neutral-950 dark:text-neutral-400">
        <div className="flex flex-col gap-y-2">
          <span className="px-4 sm:px-6 lg:px-10 text-sm">India</span>
          <div className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800"></div>
          <div className="flex flex-col sm:flex-row px-4 sm:px-6 lg:px-10 text-sm gap-y-3 sm:gap-y-0 sm:justify-between">
            <ul className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
              <li className="hover:underline cursor-pointer">
                <Link to="/founders">Meet the Creators</Link>
              </li>
            </ul>
            <ul className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
              <li className="hover:underline cursor-pointer">Privacy</li>
              <li className="hover:underline cursor-pointer">Terms</li>
              <li className="hover:underline cursor-pointer">
                <Link to="/settings">Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
